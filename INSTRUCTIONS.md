# Irfaaz Roofing Website - Admin Instructions

## 🎯 How the System Works

Your website has two parts:
1. **Main Website** (`index.html`) - What visitors see
2. **Admin Panel** (`admin.html`) - Where you manage projects

Projects created in the admin panel **automatically appear** on the main website!

---

## 📋 Step-by-Step Guide

### **Step 1: Start a Web Server**

Open Terminal in the project folder and run:
```bash
python3 -m http.server 8000
```

Then open your browser to:
- Main Website: `http://localhost:8000/index.html`
- Admin Panel: `http://localhost:8000/admin.html`

---

### **Step 2: Login to Admin Panel**

1. Open `http://localhost:8000/admin.html`
2. Enter password: **admin123**
3. Click "Login"

---

### **Step 3: Add a New Project**

1. Click the **"Manage Projects"** tab (first tab)
2. Click **"+ Add New Project"** button
3. Fill in the form:

#### Project Information
- **Title**: e.g., "Residential Roofing - Smith House"
- **Description**: Brief overview of the project
- **Completion Date**: e.g., "January 2026"
- **Duration**: e.g., "2 weeks"

#### Location
- **Address**: Full project address

#### Owner Information
- **Name**: Owner's name
- **Phone**: Contact phone number
- **Email**: Contact email

#### Upload Images (3 Categories)
- **Output/Final Images**: Choose files showing completed work
- **In-Progress Images**: Choose files showing construction stages
- **Material Images**: Choose files showing raw materials

💡 You can upload multiple images for each category!

#### Materials Used
1. Click **"+ Add Material"** to add a row
2. Fill in:
   - Material name
   - Quantity
   - Supplier
3. Add more materials as needed
4. Remove unwanted materials with the × button

4. Click **"Save Project"**

---

### **Step 4: View on Main Website**

1. Open `http://localhost:8000/index.html`
2. Scroll to **"Our Work"** section
3. Your project appears automatically! 🎉
4. Click on any project to see full details in a popup

---

## 🔄 How Data Syncs

- **Admin Panel** → Creates/edits projects → Saves to browser storage
- **Main Website** → Reads from browser storage → Displays projects

**Important**: Both pages must be opened in the **same browser** on the **same computer** for data sharing to work.

---

## 📝 Managing Projects

### Edit a Project
1. Go to Admin Panel → "Manage Projects"
2. Click **✏️ Edit** button on any project
3. Update information
4. Click "Save Project"
5. Refresh main website to see changes

### Delete a Project
1. Go to Admin Panel → "Manage Projects"
2. Click **🗑️ Delete** button
3. Confirm deletion
4. Refresh main website - project removed!

---

## 🖼️ Image Guidelines

**Best Practices:**
- Use high-quality images (recommended: 1200px+ width)
- JPG format for photos, PNG for graphics
- Keep file sizes under 5MB each
- Use descriptive file names

**Image Types:**
- **Output Images**: Final completed work, glamour shots
- **Progress Images**: During construction, different stages
- **Material Images**: Raw materials, supplies, tools used

---

## 🔒 Security

**Change Default Password:**
1. Open `admin-script.js` in a text editor
2. Find line 2: `const ADMIN_PASSWORD = 'admin123';`
3. Change to your secure password
4. Save file

---

## 💾 Data Storage

- All data stored in browser's **localStorage**
- Data persists after closing browser
- No internet required after initial load
- To backup: Export browser data or keep project records

---

## 🐛 Troubleshooting

**Projects not showing on main website?**
1. Make sure you're using the same browser for admin and main site
2. Check browser console (F12) for error messages
3. Refresh the main website page
4. Clear browser cache and try again

**Images not loading?**
- Images are stored as base64 data in browser storage
- Large images may take longer to load
- Browser storage limit: ~5-10MB total

**Lost admin password?**
- Edit `admin-script.js`, line 2 to reset

---

## 📞 Quick Reference

| Task | Location | Action |
|------|----------|--------|
| Add Project | Admin → Manage Projects | + Add New Project |
| Edit Project | Admin → Manage Projects | ✏️ Edit |
| Delete Project | Admin → Manage Projects | 🗑️ Delete |
| View Projects | Main Website | Our Work section |
| Upload Images | Admin → Old Upload Tabs | Choose files |
| Change Password | admin-script.js | Line 2 |

---

## 🎨 Customization

**Change Hero Background Image:**
1. Add image to `images/` folder as `hero-background.jpg`
2. Refresh website

**Customize Colors:**
- Edit `style.css` for main website
- Edit `admin-style.css` for admin panel

---

**Need Help?** Check browser console (F12) for debug messages marked with ✅ or ❌
