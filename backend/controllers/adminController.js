const Employee = require('../models/employee'); // Import the Employee model

// Fetch all employees with pagination
exports.findAllEmployees = async (req, res) => {
    const { skip, limit } = req.query; // Get pagination parameters from query params

    try {
        // Fetch employees with pagination using Sequelize
        const employees = await Employee.findAll({
            offset: parseInt(skip),   // Offset (starting point) for pagination
            limit: parseInt(limit),   // Limit (number of records to fetch)
            order: [['id', 'ASC']]    // Order by employee ID in ascending order
        });

        // Count total employees in the database
        const totalEmployees = await Employee.count();

        return res.status(200).json({
            employees,         // Return fetched employees
            total: totalEmployees, // Return total number of employees
            skip: parseInt(skip),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error('Error fetching employees: ', error);
        return res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};
