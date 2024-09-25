import db from '../config/db.js'; // Import the database connection

class Employee {
    constructor(employeeName, phoneNumber, address, password, designation, department) {
        this.employeeName = employeeName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.password = password; // Store hashed password
        this.designation = designation;
        this.department = department;
    }

    // Method to save the employee to the database
    async save() {
        const query = `
            INSERT INTO employees (employeeName,phoneNumber, address, password, designation, department)
            VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [this.employeeName, this.phoneNumber, this.address, this.password, this.designation, this.department];

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    // Method to find an employee by ID
    static async findById(id) {
        const query = 'SELECT * FROM employees WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]); // Return the first result
            });
        });
    }

    // Method to find an employee by phone number
    static async findByPhoneNumber(phoneNumber) {
        const query = 'SELECT * FROM employees WHERE phoneNumber = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [phoneNumber], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results[0]); // Return the first result
            });
        });
    }
}

export default Employee;