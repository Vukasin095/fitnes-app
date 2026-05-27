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
      gymCode: user.gymCode,
      membershipActive: user.membershipActive,
      membershipStart: user.membershipStart,
      membershipExpires: user.membershipExpires,
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

  const now = new Date();
  const isGymMember = gymCode === 'FITNES2026';

  const user = await User.create({
    name,
    email,
    password,
    gymCode: isGymMember ? gymCode : '',
    isGymMember: isGymMember,
    membershipActive: false,
    membershipStart: null,
    membershipExpires: null,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isGymMember: user.isGymMember,
      gymCode: user.gymCode,
      membershipActive: user.membershipActive,
      membershipStart: user.membershipStart,
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
      const membershipActive = user.membershipExpires && user.membershipExpires > Date.now();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            isGymMember: user.isGymMember,
            gymCode: user.gymCode,
            membershipActive: user.membershipActive,
            membershipStart: user.membershipStart,
            membershipExpires: user.membershipExpires,
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
    const now = new Date();
    if (req.body.gymCode && req.body.gymCode === 'FITNES2026' && !user.isGymMember) {
      user.gymCode = req.body.gymCode;
      user.isGymMember = true;
      user.membershipActive = false;
      user.membershipStart = null;
      user.membershipExpires = null;
    }

    const updatedUser = await user.save();

    const membershipActive = updatedUser.membershipActive && updatedUser.membershipExpires && updatedUser.membershipExpires > new Date();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isGymMember: updatedUser.isGymMember,
      gymCode: updatedUser.gymCode,
      membershipActive: membershipActive,
      membershipStart: updatedUser.membershipStart,
      membershipExpires: updatedUser.membershipExpires,
    });
  } else {
    res.status(404);
    throw new Error('Korisnik nije pronađen');
  }
});

// @desc    Activate membership after purchase
// @route   POST /api/users/membership/activate
// @access  Private
const activateMembership = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const now = new Date();
    
    // Ako korisnik nije već registrovani član, postavimo ga sada
    if (!user.isGymMember) {
      user.isGymMember = true;
      user.gymCode = 'MEMBERSHIP_PURCHASE';
    }

    user.membershipActive = true;
    user.membershipStart = now;
    user.membershipExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isGymMember: updatedUser.isGymMember,
      gymCode: updatedUser.gymCode,
      membershipActive: updatedUser.membershipActive,
      membershipStart: updatedUser.membershipStart,
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
    authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, activateMembership,
    getUsers, getUserById, deleteUser, updateUser
};
