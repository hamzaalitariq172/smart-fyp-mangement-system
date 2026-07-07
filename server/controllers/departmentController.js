const Department = require('../models/Department');

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'name email').sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('head', 'name email');
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, code, head, description } = req.body;
    const exists = await Department.findOne({ $or: [{ name }, { code }] });
    if (exists) return res.status(400).json({ message: 'Department name or code already exists' });
    const department = await Department.create({ name, code, head, description });
    const populated = await Department.findById(department._id).populate('head', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('head', 'name email');
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment };
