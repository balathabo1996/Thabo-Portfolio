# Portfolio Website

A professional, fully dynamic portfolio website built with Node.js, Express, and MongoDB. This project showcases the work, skills, and experience of an Infrastructure Engineer & IT Professional.

## 🚀 Features

### Core Features

- **Dynamic Content**: Profile picture and resume are fetched dynamically from MongoDB.
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop.
- **Theme System**: Toggle between Dark and Light modes with persistent user preference.
- **Animations**: Smooth entrance animations, floating effects, and glassmorphism styling.
- **Contact Form**: Integrated with Formspree for handling contact submissions.

### Technical Highlights

- **Backend**: Node.js & Express server architecture.
- **Database**: MongoDB for storing profile data and resume files.
- **Frontend**: Vanilla HTML/CSS/JS with modern CSS3 features (Variables, Flexbox, Grid).
- **Architecture**: MVC (Model-View-Controller) pattern for code organization.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Styling**: CSS3 (Custom properties, animations)
- **Icons**: FontAwesome

## 📂 Project Structure

```
Thabo_Portfolio/
├── config/              # Configuration files
├── controllers/         # Request handlers (logic)
│   ├── mainController.js    # Page navigation & resume
│   └── profileController.js # Profile API
├── models/              # Database schemas
│   ├── ProfileModel.js      # User profile schema
│   └── resume.js            # Resume schema
├── public/              # Static assets
│   ├── images/              # Image files
│   ├── scripts/             # Client-side JS
│   │   ├── contact.js       # Form handling
│   │   ├── profile.js       # Dynamic image loader
│   │   └── theme.js         # Theme toggle logic
│   └── styles/              # CSS files
├── routes/              # Route definitions
│   └── mainRoutes.js        # App routes
├── views/               # HTML pages
│   ├── index.html           # Home page
│   ├── about.html           # About page
│   ├── contact.html         # Contact page
│   └── portfolio.html       # Portfolio page
├── server.js            # Application entry point
└── .env                 # Environment variables
```

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Thabo_Portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory with the following:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   MONGO_DB=Thabo-Portfolio
   NODE_ENV=development
   ```

4. **Start the Server**

   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

5. **Visit the website**
   Open [http://localhost:8000](http://localhost:8000) in your browser.

## 🔄 Dynamic Features

### Profile Picture

The profile picture on the home page is loaded dynamically from MongoDB.

- **To Update**: Modify the `profileImageUrl` field in the `profiles` collection in MongoDB.
- **Default**: Loads `/images/portf.png` if no database entry exists.

### Resume Download

The "Download Resume" button fetches the latest resume PDF directly from MongoDB.

- **To Update**: Upload a new binary file to the `Resume` collection in MongoDB.

## 🎨 Theme Customization

The project uses CSS variables for easy theming in `public/styles/style.css`.

- **Dark Mode**: Default theme with deep blue/black tones.
- **Light Mode**: Clean, bright theme with high contrast.

## 📝 License

This project is licensed under the ISC License.
