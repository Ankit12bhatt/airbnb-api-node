# AirNB

Rent room for view days enjoy the location, hang around and leve after few days 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Host Route](#host-route)
  - [User Route](#user-route)
  - [Review and Payment Route](#Review-and-Payment-Route)
- [Additional Features](#additional-features)
- [License](#license)

## Installation

1. Clone the repository:

```bash
git clone [url]

npm install 
```
## Usage
### 1. Registration:

Endpoint: POST /api/register

Description: Register a new user.

Request Body: 
```bash 
{
  "firstName": "perry",
  "lastName": "ferry",
  "email": "perry@example.com",
  "contact": 1231311321,
  "password": "password"
}
```
### 2. User-Login
Endpoint: POST /api/login

Description: Log in with existing user credentials and receive an access token.

Request Body:

```bash
{
  "email": "perry@example.com",
  "password": "password"
}
```

### 3. Host-Route

- Add a Place: POST /api/host/place

- Update a Place: PUT /api/host/place/:id

- Delete a Place: DELETE /api/host/place/:id

- Check Pending Bookings: GET /api/host/bookings/pending

- Update Booking Status: PATCH /api/host/booking/:id

### 4. User-Route

- Search All Places: GET /api/userRoute/places

- Look For a Place: GET /api/userRoute/place/:id

- Get Recommended Place: GET /api/userRoute/recommended

- Book a Place: POST /api/userRoute/bookPlace

- Check Status of a Place: GET /api/userRoute/status
- JOI Form Validation for Booking is implemented.

### 5. Review-and-Payment-Route

- Places User Can Review: GET api/reviewPaymentRoute/review

- Post a Review For a Place: POST api/reviewPaymentRoute/review

- Delete a Review For a Place: DELETE api/reviewPaymentRoute/review

- Get Rating Of a Place: GET api/reviewPaymentRoute/rating

- Make a Payment via Strip: POST api/reviewPaymentRoute/payment

## Additional Features

- Token generation on user login.

- Rate limiting: Only 10 login requests allowed in 15 minutes.

- Preventing user from having two bookings on the same date.

- One place can have one booking at a time 

## License
This project is licensed under DILLON.ANKIT.

```bash 

This single file includes all the necessary content for you to run your code.

```

<img src="readMEAsset/screenshot.png" >