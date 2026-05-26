import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGymMember: user.isGymMember, 
      membershipExpires: user.membershipExpires,
      gymCode: user.gymCode, 
    });
  } else {
    res.status(401);
    throw new Error('Neispravan email ili lozinka');
  }
});
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, gymCode } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Korisnik već postoji');
  }

  // Ako je uneo ispravan kod, odmah postaje član teretane i članarina mu važi mesec dana
  const isGymMember = gymCode === 'FITNES2026';
  const membershipExpires = isGymMember ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;

  const user = await User.create({
    name,
    email,
    password,
    gymCode: isGymMember ? gymCode : '',
    isGymMember,
    membershipExpires,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGymMember: user.isGymMember,
      membershipExpires: user.membershipExpires,
    });
  } else {
    res.status(400);
    throw new Error('Nevalidni podaci o korisniku');
  }
});

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: 'Logged out successfully ' });
});
// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Ako korisnik naknadno unese kod na profilu
    if (req.body.gymCode && req.body.gymCode === 'FITNES2026' && !user.isGymMember) {
      user.gymCode = req.body.gymCode;
      user.isGymMember = true;
      user.membershipExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Aktivacija na 30 dana
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isGymMember: updatedUser.isGymMember,
      membershipExpires: updatedUser.membershipExpires,
    });
  } else {
    res.status(404);
    throw new Error('Korisnik nije pronađen');
  }
});

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    res.send('Get users');
});
// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    res.send('Get user by ID');
});
// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    res.send('Delete user');
});
// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    res.send('Update user');
});
export {
    authUser, registerUser, logoutUser, getUserProfile, updateUserProfile,
    getUsers, getUserById, deleteUser, updateUser
};
