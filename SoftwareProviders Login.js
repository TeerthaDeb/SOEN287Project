const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname )));

// MySQL Connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projectforsoen_287',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err.message);
    process.exit(1); // Exit the application if there's an error connecting to the database
  }
  console.log('Connected to MySQL database');
});

// Endpoint for client registration
app.post('/clientRegister', (req, res) => {
  const { firstName, lastName, email, address, password } = req.body;

  // Check if the email is already present in the database
  const checkEmailQuery = 'SELECT * FROM clients WHERE email = ?';
  connection.query(checkEmailQuery, [email], (checkEmailErr, results) => {
    if (checkEmailErr) {
      console.error('Error checking email in the database: ', checkEmailErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      // Email already exists, send a response accordingly
      res.status(409).json({ error: 'Email already exists' });
    } 
    
    else {
      // Email doesn't exist, proceed with client registration
      const insertClientQuery = 'INSERT INTO clients (first_name, last_name, address, email, password) VALUES (?, ?, ?, ?, ?)';
      connection.query(insertClientQuery, [firstName, lastName, address, email, password], (insertErr, insertResults) => {
        if (insertErr) {
          console.error('Error inserting client into the database: ', insertErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Client successfully registered
        res.status(200).json({ message: 'Client registered successfully' });
      });
    }
  });
});



// Endpoint for user login
app.post('/clientLogin', (req, res) => {
  const { email, password } = req.body;
  
  // Query the database to check if the user exists
  const loginQuery = 'SELECT client_id, first_name, last_name FROM clients WHERE email = ? AND password = ?';
  connection.query(loginQuery, [email, password], (loginErr, results) => {
    if (loginErr) {
      console.error('Error checking login credentials in the database: ', loginErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      // User found, send client_id and name in the response
      var client_id = results[0].client_id;
      var name = results[0].first_name + " " + results[0].last_name;
      res.status(200).json({
        client_id: results[0].client_id,
        name: results[0].first_name + " " + results[0].last_name
      });
      console.log("sent" + client_id + " " + name);
    } 
    else {
      // User not found, send a 401 status (Unauthorized)
      res.status(401).json({ error: 'Invalid email or password' });
    }
  });
});
// Endpoint to get user data by client_id
app.get('/getClientById', (req, res) => {
  const { client_id } = req.query;

  // Query the database to get user data by client_id
  const getUserQuery = 'SELECT * FROM clients WHERE client_id = ?';
  connection.query(getUserQuery, [client_id], (getUserErr, results) => {
    if (getUserErr) {
      console.error('Error getting user data from the database: ', getUserErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      // User data found, send it in the response
      res.status(200).json(results[0]);
    } else {
      // User not found, send a 404 status (Not Found)
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// Endpoint to update client profile
app.post('/updateClient', (req, res) => {
  const { client_id, first_name, last_name, email } = req.body;

  // Check if the new email is not being used by other users
  const checkEmailQuery = 'SELECT * FROM clients WHERE email = ? AND client_id != ?';
  connection.query(checkEmailQuery, [email, client_id], (checkEmailErr, results) => {
    if (checkEmailErr) {
      console.error('Error checking email in the database: ', checkEmailErr);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      // Email is already used by another user, send a 409 status (Conflict)
      res.status(409).json({ error: 'Email already exists' });
    } else {
      // Email is not being used, proceed with profile update
      const updateProfileQuery = 'UPDATE clients SET first_name = ?, last_name = ?, email = ? WHERE client_id = ?';
      connection.query(updateProfileQuery, [first_name, last_name, email, client_id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating client profile in the database: ', updateErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Profile successfully updated
        res.status(200).json({ message: 'Profile updated successfully' });
      });
    }
  });
});

// Endpoint to change client password
app.post('/changePassword', (req, res) => {
  const { client_id, newPassword } = req.body;

  // Update client password in the database
  const updatePasswordQuery = 'UPDATE clients SET password = ? WHERE client_id = ?';
  connection.query(updatePasswordQuery, [newPassword, client_id], (updateErr) => {
      if (updateErr) {
          console.error('Error updating client password in the database: ', updateErr);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      // Password successfully updated
      res.status(200).json({ message: 'Password changed successfully' });
  });
});

var currentProviderId = null;
// Signup route
app.post('/signup', (req, res) => {
  const { Organization, email, pswd } = req.body;
  const provider = {
    provider_name: Organization,
    email,
    password: pswd
  };

  connection.query('INSERT INTO software_providers SET ?', provider, (error, results, fields) => {
    if (error) {
      console.error('Error in signup:', error);
      res.status(500).send('Error in signup');
    } else {
      console.log('Signup successful');
      res.status(200).send('Congratulations! You signed up successfully. Please go back and proceed to login.');
    }
  });
});

// Login route
app.post('/signin', (req, res) => {
  const { email, pswd } = req.body;

  // Select provider_id, provider_name, email, password
  connection.query('SELECT provider_id, provider_name, email, password FROM software_providers WHERE email = ? AND password = ?', [email, pswd], (error, results, fields) => {
    if (error) {
      console.error('Error in login:', error);
      res.status(500).send('Error in login');
    } else {
      if (results.length > 0) {
        const { provider_id, provider_name, email, password } = results[0];
        currentProviderId = provider_id;
        // Redirect to dashboard and pass provider_name
        res.render('Software Provider\'s Dashboard', { providerName: provider_name, providerData: results });
      } else {
        console.log('Invalid credentials');
        res.status(401).send('Invalid credentials');
      }
    }
  });
});


// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




app.post('/createProduct', (req, res) => {
  const { productName, productDetails, price } = req.body;

  // Ensure that currentProviderId has a valid value before using it
  if (!currentProviderId) {
    res.status(400).send('Provider not authenticated');
    return;
  }

  const newProduct = {
    product_name: productName,
    description: productDetails,
    price: price,
    provider_id: currentProviderId, // Use the stored provider_id
  };

  connection.query('INSERT INTO products SET ?', newProduct, (error, results, fields) => {
    if (error) {
      console.error('Error creating product:', error);
      res.status(500).send('Error creating product');
    } else {
      console.log('Product created successfully with the name:' + productName + productDetails + price);
      res.status(200).send('Product created successfully');
    }
  });
});


// Route to fetch products
app.get('/fetchProducts', (req, res) => {
  connection.query('SELECT * FROM products WHERE provider_id = ?', currentProviderId, (error, results) => {
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ message: 'Failed to fetch products!' });
    }
    res.status(200).json(results);
  });
});


app.post('/removeProduct', (req, res) => {
  const productId = req.body.productId;

  // Perform the database operation to remove the product with the specified ID
  connection.query('DELETE FROM products WHERE product_id = ?', productId, (error, results) => {
    if (error) {
      console.error('Error removing product:', error);
      return res.status(500).json({ message: 'Failed to remove product!' });
    }

    res.status(200).json({ message: 'Product removed successfully!' });
  });
});


app.post('/changePassword', (req, res) => {
  const provider_id = currentProviderId;

  // Retrieve the new password from the request body
  const newPassword = req.body.newPassword;

  // Perform the database operation to update the user's password
  connection.query('UPDATE software_providers SET password = ? WHERE provider_id = ?', [newPassword, provider_id], (error, results) => {
    if (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ message: 'Failed to change password!' });
    }

    res.status(200).json({ message: 'Password changed successfully!' });
  });
});


app.post('/updateProductDetails', (req, res) => {
  const { productName, productDetails, price, productId } = req.body;

  // Perform the database operation to update the product details
  connection.query(
    'UPDATE products SET description = ?, price = ? WHERE product_name = ?',
    [productDetails, price, productName],
    (error, results) => {
      if (error) {
        console.error('Error updating product details:', error);
        return res.status(500).json({ message: 'Failed to update product details!' });
      }

      res.status(200).json({ message: 'Product details updated successfully!' });
    }
  );
});


app.post('/createCustomer', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    address,
    product,
    paymentMethod,
    subscriptionType,
  } = req.body;

  // Perform the database operation to create a new customer
  connection.query(
    'INSERT INTO clients (first_name, last_name, email , address) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, address],
    (error, results) => {
      if (error) {
        console.error('Error creating customer:', error);
        return res.status(500).json({ message: 'Failed to create customer!' });
      }

      // Assume you have the client ID from the inserted row
      const clientId = results.insertId;


      connection.query(
        'INSERT INTO purchase (client_id, product_id, license_number, expiry_date, payment_method) VALUES (?, ?, ?, ?, ?)',
        [clientId, 5, 'generated_license_number', 'expiry_date', paymentMethod],
        (purchaseError, purchaseResults) => {
          if (purchaseError) {
            console.error('Error creating purchase record:', purchaseError);
            return res.status(500).json({ message: 'Failed to create purchase record!' });
          }

          res.status(200).json({ message: 'Customer and purchase record created successfully!', clientId });
        }
      );
    }
  );
});


app.get('/purchases', (req, res) => {
  const providerId = currentProviderId;
  console.log('Reached the /purchases route');
  const query = `
    SELECT
        pu.purchase_id,
        pu.client_id,
        pu.product_id,
        pu.expiry_date,
        pr.provider_id
    FROM
        purchase pu
    JOIN
        products pr ON pu.product_id = pr.product_id
    JOIN
        software_providers sp ON pr.provider_id = sp.provider_id
    WHERE
        sp.provider_id = ?;
  `;

  connection.query(query, [providerId], (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Failed to fetch data!' });
    }

    res.render('Software providers Customers Table', { purchases: results }); // Assuming you use a templating engine like EJS
  });
});


// Close the MySQL connection when the application is shutting down
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) console.error(err);
    console.log('MySQL connection closed');
    process.exit(0);
  });
});

