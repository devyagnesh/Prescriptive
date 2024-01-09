# Prescriptive App API

## Overview

The Prescriptive App API is a powerful tool designed to simplify and streamline the management of customer prescriptions for optical store owners. Leveraging the robust combination of Node.js, Express.js, MongoDB, and TypeScript, this API provides a comprehensive solution for creating, storing, and sharing digital prescriptions with ease.

## Features

- **Customer Management**: Effortlessly add and manage customer information, including personal details and prescription history.
- **Digital Prescription Creation**: Enable optical store owners to create digital prescriptions seamlessly, capturing essential details such as lens specifications, prescription date, and doctor's recommendations.
- **Secure Data Storage**: Leverage MongoDB to ensure secure and scalable storage of customer and prescription data, providing a reliable foundation for your application.
- **WhatsApp Integration**: Facilitate easy prescription sharing by integrating with WhatsApp and other communication channels, allowing store owners to send digital prescriptions directly to their customers.
- **User-Friendly Interface**: Implement a clean and intuitive interface for a smooth user experience, making it easy for optical store owners to navigate and utilize the app efficiently.

## Tech Stack

- **Node.js**: A runtime environment for executing JavaScript code on the server side.
- **Express.js**: A web application framework for Node.js, providing a robust set of features for web and mobile applications.
- **MongoDB**: A NoSQL database for storing and retrieving customer and prescription data efficiently.
- **TypeScript**: Enhance code readability, maintainability, and scalability by using TypeScript to add static typing to your JavaScript code.

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
PORT=
MONGO_URI=mongodb://localhost:27017/<yourdbname>
REFRESH_TOKEN_SECRET=<your secret>
REFRESH_TOKEN_VALIDITY=<your validity>
JWT_EMAIL_SECRET=<email secret>
SMTP_HOST=<your email host>
SMTP_PORT=465
SMTP_USERNAME=<user@example.com>
SMTP_PASSWORD=<password>
SMTP_SENDER=<sender>
SMTP_TLS=true
```

## Getting Started

1.**Clone the Repository**:

Begin by cloning the Prescriptive App API repository to your local machine.

```bash
git clone https://github.com/devyagnesh/Prescriptive.git
```

2.**Install Dependencies**:
Navigate to the project directory and install the necessary dependencies.

```bash
cd prescriptive/api
npm install
```

## Contact

For any inquiries or support, please contact [yagneshchavda8141@gmail.com](mailto:yagneshchavda8141@gmail.com).
