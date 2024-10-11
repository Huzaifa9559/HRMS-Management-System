const Employee = require('../../models/employee'); // Import the Employee model
const { sendCreateAccountLink } = require('../../service/nodemailer');


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


exports.inviteEmployee = async (req, res) => {
    const { email } = req.body;
    try {
        // Send the create account link to the user's email and handle the response
        await sendCreateAccountLink(email);
        return res.status(200).json({ message: 'Create Account link sent to your email', success: true });
    } catch (error) {
        console.error('Error sending Create Account link:', error);
        return res.status(500).json({ message: 'Failed to send Create Account link', success: false, error: error.message });
    }
};

//another functionality will be made in admin that will admin approves the employee created
//and changes its status (pending,enabled,disabled)

