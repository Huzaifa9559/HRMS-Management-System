const WorkSchedule = require('../models/workschedule');
const Employee=require('../models/employee');
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function

exports.getEmployeeWorkSchedule = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;
    const month = req.params.month;
    try {
        const payload = getUser(token);
        const workschedule = await WorkSchedule.getWorkScheduleByEmployeeId(payload._id, month);
        if (!workschedule) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Work schedule not found for this employee');
        }
        return sendResponse(res, httpStatus.OK, workschedule, 'Work schedule retrieved successfully');
    } catch (error) {
        console.error('Error fetching work schedule:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching work schedule', error.message);
    }
};

exports.getAllEmployeesWorkSchedule = async (req, res) => {
    const month = req.params.month;
    try {
        // Fetch work schedules for all employees for the given month
        const schedules = await WorkSchedule.getWorkSchedulesByMonth(month);
 
// Transform the schedules into the desired format
const formattedSchedules = await Promise.all(
    schedules.map(async employee => {
        const { employeeID, schedules } = employee;

        try {
            // Fetch employee details from database
            const mockEmployeeData = await Employee.getEmployeeDetails(employeeID);

            return {
                id: employeeID,
                name: mockEmployeeData.name || "Unknown",
                role: mockEmployeeData.designation_name || "Unknown Role",
                department: mockEmployeeData.department_name || "Unknown Department",
                image: mockEmployeeData.employee_image || 'https://via.placeholder.com/150',
                schedule: schedules.flatMap(week =>
                    week.days.map(day => ({
                        day: day.day,
                        time: `${day.startTime} - ${day.endTime}`,
                        location: day.workType,
                    }))
                ),
            };
        } catch (error) {
            console.error(`Error fetching employee details for ID ${employeeID}:`, error);

            // Return a fallback for this employee in case of error
            return {
                id: employeeID,
                name: "Error fetching data",
                role: "N/A",
                department: "N/A",
                image: 'https://via.placeholder.com/150',
                schedule: [],
            };
        }
    })
);


        return sendResponse(res, httpStatus.OK, formattedSchedules, 'Work schedules retrieved successfully');
    } catch (error) {
        console.error('Error fetching all employees work schedules:', error);
        return sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            null,
            'Error fetching all employees work schedules',
            error.message
        );
    }
};

exports.editEmployeeWorkSchedule = async (req, res) => {
    const { id,month } = req.params; // Employee ID
    const { schedule } = req.body; // Updated schedule array
    try {
        // Validate the input schedule
        for (const entry of schedule) {
            const [startHour, startMinute] = entry.time.split(' - ')[0].split(':');
            const [endHour, endMinute] = entry.time.split(' - ')[1].split(':');

            const startTime = new Date(0, 0, 0, parseInt(startHour, 10), parseInt(startMinute, 10));
            const endTime = new Date(0, 0, 0, parseInt(endHour, 10), parseInt(endMinute, 10));

            if (startTime >= endTime) {
                return sendResponse(
                    res,
                    httpStatus.BAD_REQUEST,
                    null,
                    'Start time must be earlier than end time for all entries'
                );
            }
        }

        // Fetch the employee to ensure they exist
        const employee = await Employee.getEmployeeDetails(id);
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }

        // Update the schedule
        const updatedSchedule = await WorkSchedule.updateEmployeeWorkSchedule(id, schedule,month);

        if (!updatedSchedule) {
            return sendResponse(
                res,
                httpStatus.INTERNAL_SERVER_ERROR,
                null,
                'Failed to update work schedule'
            );
        }

        return sendResponse(res, httpStatus.OK, updatedSchedule, 'Work schedule updated successfully');
    } catch (error) {
        console.error(`Error updating work schedule for employee ID ${id}:`, error);
        return sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            null,
            'Error updating work schedule',
            error.message
        );
    }
};
exports.createNewWorkSchedule = async (req, res) => {
    const { employeeId, schedule, months } = req.body; // Employee ID, schedule array, and months

    try {
        //Validate the input schedule (time format validation)
        for (const entry of schedule) {
            const [startHour, startMinute] = entry.time.split(' - ')[0].split(':');
            const [endHour, endMinute] = entry.time.split(' - ')[1].split(':');

            const startTime = new Date(0, 0, 0, parseInt(startHour, 10), parseInt(startMinute, 10));
            const endTime = new Date(0, 0, 0, parseInt(endHour, 10), parseInt(endMinute, 10));

            if (startTime >= endTime) {
                return sendResponse(
                    res,
                    httpStatus.BAD_REQUEST,
                    null,
                    'Start time must be earlier than end time for all entries'
                );
            }
        }

        // Fetch the employee to ensure they exist
        const employee = await Employee.getEmployeeDetails(employeeId);
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }

   for (const month of months) {
    for (const day of schedule) {  // Loop through the days in the schedule
        const existingSchedule = await WorkSchedule.getWorkScheduleByEmployeeIdMonthDay(employeeId, month, day.day);
        if (existingSchedule && existingSchedule.length > 0) {
            return sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                null,
                `Work schedule already exists for this employee on ${day.day} of ${month}, you can edit it instead.`
            );
        }
    }
}

        // Loop through each month to create the work schedule
        for (const month of months) {
            try {
                await WorkSchedule.createWorkSchedule(employeeId, schedule, month);
            } catch (error) {
                console.error(`Error creating work schedule for employee ${employeeId} in ${month}:`, error);
                return sendResponse(
                    res,
                    httpStatus.INTERNAL_SERVER_ERROR,
                    null,
                    `Error creating work schedule for employee ${employeeId} in ${month}`,
                    error.message
                );
            }
        }

        return sendResponse(res, httpStatus.CREATED, null, 'Work schedule created successfully for all selected months.');

    } catch (error) {
        console.error('Error in creating work schedule:', error);
        return sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            null,
            'Error creating work schedule',
            error.message
        );
    }
};
