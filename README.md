#  Inventory Management System for AEC Businesses

A complete inventory management solution built with Next.js and Express.js for Architecture, Engineering, and Construction material businesses.

## 📋 Features

- ✅ Real-time inventory tracking
- ✅ Low stock alerts and notifications
- ✅ SKU performance analytics
- ✅ Damage/expiry tracking
- ✅ Overstock detection
- ✅ Responsive dashboard
- ✅ CRUD operations for products
- ✅ RESTful API backend

## 🛠️ Technology Stack

**Frontend:**
- Next.js 14
- React 18
- Tailwind CSS
- Axios
- Lucide React (icons)

**Backend:**
- Express.js
- Node.js
- REST API
- In-memory data storage

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🚀 Usage

1. Start the backend server first
2. Start the frontend development server
3. Open browser at `http://localhost:3000`
4. Use the dashboard to:
   - View all inventory
   - Add/Edit/Delete products
   - Check low stock alerts
   - View analytics

## 📊 API Endpoints
```
GET    /api/products              - Get all products
GET    /api/products/:id          - Get single product
POST   /api/products              - Create product
PUT    /api/products/:id          - Update product
DELETE /api/products/:id          - Delete product
GET    /api/products/alerts/low-stock  - Get low stock alerts
GET    /api/products/analytics/summary - Get analytics
```

## 📁 Project Structure
```
inventory-management/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── products.js
│   ├── controllers/
│   │   └── productController.js
│   ├── models/
│   │   └── Product.js
│   └── package.json
├── frontend/
│   ├── pages/
│   │   ├── _app.js
│   │   └── index.js
│   ├── styles/
│   │   └── globals.css
│   ├── next.config.js
│   └── package.json
└── README.md
```

## 🎯 Problem Solving Approach

This system addresses key inventory challenges:

1. **No Visibility** → Real-time dashboard
2. **Dead Inventory** → Performance analytics
3. **Low Margins** → Damage tracking
4. **Scaling Issues** → Automated alerts

## 🔧 Troubleshooting

**Backend not starting:**
- Check if port 5000 is available
- Run `npm install` again
- Check Node.js version

**Frontend errors:**
- Ensure backend is running
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies

**API connection issues:**
- Verify backend URL in `next.config.js`
- Check CORS settings in backend

## 📈 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication
- Email/SMS notifications
- Excel export functionality
- Barcode scanning
- Multi-warehouse support
- Advanced reporting

## 👨‍💻 Author

SDE Intern Assignment - Insyd Software

## 📄 License

This project is for assignment purposes.
