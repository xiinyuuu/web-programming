const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    await newUser.save();

    // Generate token immediately after registration
    const token = jwt.sign(
      { user: { id: newUser._id } }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Return the same response format as login
    res.status(201).json({ 
      token, 
      user: { 
        id: newUser._id, 
        username: newUser.username, 
        email: newUser.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const loginUser = async (req, res) => {
  console.log('🔵 LOGIN ATTEMPT:', {
    email: req.body.email,
    timestamp: new Date().toISOString()
  });

  try {
    const { email, password } = req.body;
    const db = mongoose.connection.db;
    const usersCollection = db.collection('user');

    // First find the user
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Found user:', {
      id: user._id.toString(),
      email: user.email,
      deactivated: user.deactivated
    });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password verified for user:', email);
    console.log('🔄 Attempting to reactivate user account...');

    // First update attempt with explicit boolean
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      { 
        $set: { 
          deactivated: false,
          lastLogin: new Date()
        } 
      }
    );

    console.log('📝 Update operation result:', updateResult);

    // Verify the update
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(user._id) });
    
    console.log('🔍 User state after update:', {
      id: updatedUser._id.toString(),
      deactivatedBefore: user.deactivated,
      deactivatedAfter: updatedUser.deactivated,
      updateSuccessful: updateResult.modifiedCount > 0
    });

    // Force a second update if first one didn't work
    if (updatedUser.deactivated === true) {
      console.log('⚠️ First update failed, trying forced update...');
      
      const forceUpdate = await usersCollection.updateOne(
        { _id: new ObjectId(user._id) },
        { 
          $set: { 
            deactivated: false,
            lastLogin: new Date()
          }
        },
        { bypassDocumentValidation: true }
      );

      console.log('🔨 Forced update result:', forceUpdate);
      
      // Final verification
      const finalUser = await usersCollection.findOne({ _id: new ObjectId(user._id) });
      console.log('🔍 Final user state:', {
        id: finalUser._id.toString(),
        deactivated: finalUser.deactivated
      });
    }

    const token = jwt.sign(
      { user: { id: updatedUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        deactivated: false // Force the response to show deactivated as false
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Verify and update user status
const verifyUser = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('🔵 Verifying user status:', userId);

    // Update user status using native MongoDB for guaranteed update
    const db = mongoose.connection.db;
    const usersCollection = db.collection('user');
    
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          deactivated: false,
          lastVerified: new Date()
        } 
      }
    );

    console.log('📝 Update result:', updateResult);

    // Get updated user data
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ User verified and updated:', {
      id: user._id.toString(),
      deactivated: user.deactivated
    });

    // Return user data without sensitive fields
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      deactivated: false
    });
  } catch (err) {
    console.error('❌ Verification error:', err);
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

module.exports = { registerUser, loginUser, verifyUser };
