// Admin Authentication
const ADMIN_PASSWORD = 'admin123'; // CHANGE THIS PASSWORD!
let isAuthenticated = false;

// Elements
const loginSection = document.getElementById('loginSection');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Tab Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// File Upload Elements
const workFilesInput = document.getElementById('workFiles');
const workPreview = document.getElementById('workPreview');
const saveWorkImagesBtn = document.getElementById('saveWorkImages');
const saveMaterialImagesBtn = document.getElementById('saveMaterialImages');

// Material category inputs
const ceilingTilesInput = document.getElementById('ceilingTilesFiles');
const roofTilesInput = document.getElementById('roofTilesFiles');
const fabricationInput = document.getElementById('fabricationFiles');

// Material category previews
const ceilingTilesPreview = document.getElementById('ceilingTilesPreview');
const roofTilesPreview = document.getElementById('roofTilesPreview');
const fabricationPreview = document.getElementById('fabricationPreview');

// Stored files
let workFiles = [];
let ceilingTilesFiles = [];
let roofTilesFiles = [];
let fabricationFiles = [];

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    
    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'block';
        loginError.textContent = '';
        loadImageCounts();
    } else {
        loginError.textContent = '❌ Invalid password. Please try again.';
        passwordInput.value = '';
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    adminDashboard.style.display = 'none';
    loginSection.style.display = 'flex';
    passwordInput.value = '';
});

// Tab Navigation
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Work Files Upload
workFilesInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files, 'work');
});

// Material Category Files Upload
if (ceilingTilesInput) {
    ceilingTilesInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files, 'ceilingTiles');
    });
}

if (roofTilesInput) {
    roofTilesInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files, 'roofTiles');
    });
}

if (fabricationInput) {
    fabricationInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files, 'fabrication');
    });
}

// Handle File Upload
function handleFileUpload(files, type) {
    if (type === 'work') {
        workFiles = files.slice(0, 6); // Max 6 work images
        displayPreview(workFiles, workPreview, 'work');
        saveWorkImagesBtn.style.display = workFiles.length > 0 ? 'block' : 'none';
    } else if (type === 'ceilingTiles') {
        ceilingTilesFiles = files;
        displayPreview(ceilingTilesFiles, ceilingTilesPreview, 'ceilingTiles');
        updateMaterialSaveButton();
    } else if (type === 'roofTiles') {
        roofTilesFiles = files;
        displayPreview(roofTilesFiles, roofTilesPreview, 'roofTiles');
        updateMaterialSaveButton();
    } else if (type === 'fabrication') {
        fabricationFiles = files;
        displayPreview(fabricationFiles, fabricationPreview, 'fabrication');
        updateMaterialSaveButton();
    }
}

// Update material save button visibility
function updateMaterialSaveButton() {
    const hasFiles = ceilingTilesFiles.length > 0 || roofTilesFiles.length > 0 || fabricationFiles.length > 0;
    if (saveMaterialImagesBtn) {
        saveMaterialImagesBtn.style.display = hasFiles ? 'block' : 'none';
    }
}

// Display Preview
function displayPreview(files, container, type) {
    if (!container) return;
    container.innerHTML = '';
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            let suggestedName;
            if (type === 'work') {
                suggestedName = `work${index + 1}.jpg`;
            } else if (type === 'ceilingTiles') {
                suggestedName = `ceiling-tile${index + 1}.jpg`;
            } else if (type === 'roofTiles') {
                suggestedName = `roof-tile${index + 1}.jpg`;
            } else if (type === 'fabrication') {
                suggestedName = `fabrication${index + 1}.jpg`;
            }
            
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <button class="remove-btn" onclick="removeFile(${index}, '${type}')">×</button>
                <div class="preview-info">
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                    <input type="text" value="${suggestedName}" placeholder="Suggested filename" readonly>
                </div>
            `;
            
            container.appendChild(previewItem);
        };
        
        reader.readAsDataURL(file);
    });
}

// Remove File
function removeFile(index, type) {
    if (type === 'work') {
        workFiles.splice(index, 1);
        displayPreview(workFiles, workPreview, 'work');
        saveWorkImagesBtn.style.display = workFiles.length > 0 ? 'block' : 'none';
    } else if (type === 'ceilingTiles') {
        ceilingTilesFiles.splice(index, 1);
        displayPreview(ceilingTilesFiles, ceilingTilesPreview, 'ceilingTiles');
        updateMaterialSaveButton();
    } else if (type === 'roofTiles') {
        roofTilesFiles.splice(index, 1);
        displayPreview(roofTilesFiles, roofTilesPreview, 'roofTiles');
        updateMaterialSaveButton();
    } else if (type === 'fabrication') {
        fabricationFiles.splice(index, 1);
        displayPreview(fabricationFiles, fabricationPreview, 'fabrication');
        updateMaterialSaveButton();
    }
}

// Save Work Images
saveWorkImagesBtn.addEventListener('click', () => {
    if (workFiles.length === 0) return;
    
    showInstructions('work', workFiles);
});

// Save Material Images
saveMaterialImagesBtn.addEventListener('click', () => {
    // Load existing materials from localStorage or create new object
    let materialsData = {
        ceilingTiles: [],
        roofTiles: [],
        fabrication: []
    };
    
    const existingMaterials = localStorage.getItem('materialCategories');
    if (existingMaterials) {
        materialsData = JSON.parse(existingMaterials);
        console.log('📦 Loading existing materials to append new images...');
    }
    
    // Store the current count for each category
    const existingCounts = {
        ceilingTiles: materialsData.ceilingTiles.length,
        roofTiles: materialsData.roofTiles.length,
        fabrication: materialsData.fabrication.length
    };
    
    // Convert files to base64 for storage
    let processedFiles = 0;
    const totalFiles = ceilingTilesFiles.length + roofTilesFiles.length + fabricationFiles.length;
    
    if (totalFiles === 0) {
        alert('Please upload at least one material image in any category!');
        return;
    }
    
    // Process ceiling tiles
    ceilingTilesFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            materialsData.ceilingTiles.push({
                name: file.name,
                data: e.target.result,
                index: index
            });
            processedFiles++;
            checkIfAllProcessed();
        };
        reader.readAsDataURL(file);
    });
    
    // Process roof tiles
    roofTilesFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            materialsData.roofTiles.push({
                name: file.name,
                data: e.target.result,
                index: index
            });
            processedFiles++;
            checkIfAllProcessed();
        };
        reader.readAsDataURL(file);
    });
    
    // Process fabrication materials
    fabricationFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            materialsData.fabrication.push({
                name: file.name,
                data: e.target.result,
                index: index
            });
            processedFiles++;
            checkIfAllProcessed();
        };
        reader.readAsDataURL(file);
    });
    
    function checkIfAllProcessed() {
        if (processedFiles === totalFiles) {
            // Save to localStorage
            localStorage.setItem('materialCategories', JSON.stringify(materialsData));
            
            const newCounts = {
                ceilingTiles: materialsData.ceilingTiles.length - existingCounts.ceilingTiles,
                roofTiles: materialsData.roofTiles.length - existingCounts.roofTiles,
                fabrication: materialsData.fabrication.length - existingCounts.fabrication
            };
            
            alert(`✅ Successfully added ${totalFiles} new material images!\n\n` +
                  `NEW IMAGES:\n` +
                  `- Ceiling Tiles: +${newCounts.ceilingTiles}\n` +
                  `- Roof Tiles: +${newCounts.roofTiles}\n` +
                  `- Fabrication: +${newCounts.fabrication}\n\n` +
                  `TOTAL IMAGES:\n` +
                  `- Ceiling Tiles: ${materialsData.ceilingTiles.length}\n` +
                  `- Roof Tiles: ${materialsData.roofTiles.length}\n` +
                  `- Fabrication: ${materialsData.fabrication.length}\n\n` +
                  `Refresh your main website to see all materials!`);
            
            // Clear the file inputs and arrays
            ceilingTilesFiles = [];
            roofTilesFiles = [];
            fabricationFiles = [];
            ceilingTilesPreview.innerHTML = '';
            roofTilesPreview.innerHTML = '';
            fabricationPreview.innerHTML = '';
            ceilingTilesInput.value = '';
            roofTilesInput.value = '';
            fabricationInput.value = '';
            updateMaterialSaveButton();
            
            // Update counts
            loadImageCounts();
        }
    }
});

// Show Instructions
function showInstructions(type, files) {
    const fileList = files.map((file, index) => {
        const suggestedName = type === 'work' ? `work${index + 1}.jpg` : `material${index + 1}.jpg`;
        return `  • ${file.name} → Rename to: ${suggestedName}`;
    }).join('\n');
    
    const folder = type === 'work' ? 'work portfolio' : 'raw materials';
    
    alert(`📸 Images Ready to Save!\n\n${files.length} image(s) selected for ${folder}.\n\nInstructions:\n\n1. Manually save these files to the 'images/' folder:\n\n${fileList}\n\n2. Make sure to rename them exactly as shown above.\n\n3. Refresh your main website to see the changes!\n\nNote: Since this is a static website without a backend server, you need to manually copy the files. For automatic uploads, you would need to add a backend server (PHP, Node.js, etc.).`);
}

// Change Password
document.getElementById('changePasswordBtn').addEventListener('click', () => {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (currentPassword !== ADMIN_PASSWORD) {
        alert('❌ Current password is incorrect!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('❌ New password must be at least 6 characters long!');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('❌ New passwords do not match!');
        return;
    }
    
    alert(`✅ Password Changed!\n\nYour new password is: ${newPassword}\n\nIMPORTANT: To make this permanent, you need to:\n1. Open admin-script.js\n2. Find line 2: const ADMIN_PASSWORD = 'admin123';\n3. Change 'admin123' to '${newPassword}'\n4. Save the file\n\nOtherwise, this change will be lost when you refresh the page.`);
});

// Load Image Counts
function loadImageCounts() {
    // Check localStorage for stored materials
    const storedMaterials = localStorage.getItem('materialCategories');
    let materialCount = 0;
    
    if (storedMaterials) {
        const materials = JSON.parse(storedMaterials);
        materialCount = (materials.ceilingTiles?.length || 0) + 
                       (materials.roofTiles?.length || 0) + 
                       (materials.fabrication?.length || 0);
    }
    
    // Update the counts (work images would need similar localStorage handling)
    const workCountEl = document.getElementById('workCount');
    const materialCountEl = document.getElementById('materialCount');
    
    if (workCountEl) {
        workCountEl.textContent = '0 images (Upload new ones above)';
    }
    
    if (materialCountEl) {
        if (materialCount > 0) {
            materialCountEl.textContent = `${materialCount} images uploaded`;
        } else {
            materialCountEl.textContent = '0 images (Upload new ones above)';
        }
    }
}

// Drag and Drop Support
function setupDragAndDrop(element, type) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.style.borderColor = '#667eea';
        element.style.background = '#f8f8ff';
    });
    
    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.style.borderColor = '#e0e0e0';
        element.style.background = '#fafafa';
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.style.borderColor = '#e0e0e0';
        element.style.background = '#fafafa';
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        handleFileUpload(files, type);
    });
}

// Setup drag and drop for upload boxes
const workUploadBox = document.querySelector('#upload-work .upload-box');
if (workUploadBox) {
    setupDragAndDrop(workUploadBox, 'work');
}

// Setup drag and drop for material category boxes
const ceilingTilesBox = document.querySelector('#ceilingTilesFiles + label');
const roofTilesBox = document.querySelector('#roofTilesFiles + label');
const fabricationBox = document.querySelector('#fabricationFiles + label');

if (ceilingTilesBox?.parentElement) {
    setupDragAndDrop(ceilingTilesBox.parentElement, 'ceilingTiles');
}
if (roofTilesBox?.parentElement) {
    setupDragAndDrop(roofTilesBox.parentElement, 'roofTiles');
}
if (fabricationBox?.parentElement) {
    setupDragAndDrop(fabricationBox.parentElement, 'fabrication');
}

console.log('✅ Admin Panel Loaded Successfully');
console.log('🔐 Default Password: admin123');
console.log('⚠️  Remember to change the password in admin-script.js!');

// =========================================
// PROJECT DETAIL MODAL FUNCTIONALITY
// =========================================

// Project Data Structure
const projectsData = {
    1: {
        title: "Residential Roofing - Modern Villa",
        description: "Complete roof installation for a luxury modern villa with premium materials and exceptional craftsmanship.",
        images: [
            { url: "images/work1.jpg", caption: "Completed Project", stage: "Final" },
            { url: "images/work1-stage1.jpg", caption: "Initial Assessment", stage: "Planning" },
            { url: "images/work1-stage2.jpg", caption: "Foundation Work", stage: "Foundation" },
            { url: "images/work1-stage3.jpg", caption: "Installation Phase", stage: "Installation" },
            { url: "images/work1-stage4.jpg", caption: "Finishing Touches", stage: "Finishing" }
        ],
        materials: [
            { name: "Premium Asphalt Shingles", quantity: "30 bundles", supplier: "GAF Materials" },
            { name: "Waterproof Underlayment", quantity: "8 rolls", supplier: "Grace Ice & Water Shield" },
            { name: "Roofing Nails", quantity: "50 lbs", supplier: "Local Hardware Co" },
            { name: "Flashing & Trim", quantity: "200 linear feet", supplier: "Metal Works Inc" }
        ],
        address: "1234 Sunset Boulevard, Beverly Hills, CA 90210",
        owner: {
            name: "John & Sarah Anderson",
            phone: "(555) 987-6543",
            email: "anderson.family@email.com"
        },
        completionDate: "December 2025",
        duration: "3 weeks"
    },
    2: {
        title: "Commercial Building - Downtown Office",
        description: "Large-scale commercial roofing project for a 5-story office building in the downtown business district.",
        images: [
            { url: "images/work2.jpg", caption: "Completed Project", stage: "Final" },
            { url: "images/work2-stage1.jpg", caption: "Site Inspection", stage: "Planning" },
            { url: "images/work2-stage2.jpg", caption: "Old Roof Removal", stage: "Demolition" },
            { url: "images/work2-stage3.jpg", caption: "New Structure Install", stage: "Installation" },
            { url: "images/work2-stage4.jpg", caption: "Final Inspection", stage: "Finishing" }
        ],
        materials: [
            { name: "TPO Roofing Membrane", quantity: "15,000 sq ft", supplier: "Versico Roofing" },
            { name: "Insulation Boards", quantity: "200 sheets", supplier: "Carlisle Construction" },
            { name: "Metal Edge Flashing", quantity: "500 linear feet", supplier: "ABC Metals" },
            { name: "Commercial Fasteners", quantity: "5000 units", supplier: "Industrial Supply Co" }
        ],
        address: "789 Business Plaza, Suite 250, Los Angeles, CA 90012",
        owner: {
            name: "Metro Properties LLC",
            phone: "(555) 123-9876",
            email: "contact@metroproperties.com"
        },
        completionDate: "November 2025",
        duration: "8 weeks"
    },
    3: {
        title: "Historic Home Restoration",
        description: "Careful restoration of a 1920s historic home roof, maintaining original architectural integrity while upgrading to modern standards.",
        images: [
            { url: "images/work3.jpg", caption: "Completed Restoration", stage: "Final" },
            { url: "images/work3-stage1.jpg", caption: "Original Roof Assessment", stage: "Planning" },
            { url: "images/work3-stage2.jpg", caption: "Careful Demolition", stage: "Demolition" },
            { url: "images/work3-stage3.jpg", caption: "Custom Installation", stage: "Installation" },
            { url: "images/work3-stage4.jpg", caption: "Period Details Added", stage: "Finishing" }
        ],
        materials: [
            { name: "Cedar Shake Shingles", quantity: "45 bundles", supplier: "Heritage Wood Products" },
            { name: "Copper Flashing", quantity: "150 linear feet", supplier: "Vintage Metals" },
            { name: "Custom Ridge Caps", quantity: "Custom order", supplier: "Historic Roofing Supply" },
            { name: "Preservation Sealant", quantity: "20 gallons", supplier: "Conservation Products" }
        ],
        address: "456 Heritage Lane, Pasadena, CA 91105",
        owner: {
            name: "Elizabeth Martinez",
            phone: "(555) 456-7890",
            email: "e.martinez@historichomes.org"
        },
        completionDate: "October 2025",
        duration: "6 weeks"
    },
    4: {
        title: "Contemporary Flat Roof Design",
        description: "Modern flat roof installation with solar panel integration for an eco-friendly contemporary home.",
        images: [
            { url: "images/work4.jpg", caption: "Completed Project", stage: "Final" },
            { url: "images/work4-stage1.jpg", caption: "Design Planning", stage: "Planning" },
            { url: "images/work4-stage2.jpg", caption: "Membrane Installation", stage: "Installation" },
            { url: "images/work4-stage3.jpg", caption: "Solar Integration", stage: "Solar" },
            { url: "images/work4-stage4.jpg", caption: "Final Waterproofing", stage: "Finishing" }
        ],
        materials: [
            { name: "EPDM Rubber Membrane", quantity: "3,500 sq ft", supplier: "Firestone Building Products" },
            { name: "XPS Insulation", quantity: "120 boards", supplier: "Owens Corning" },
            { name: "Solar Panel Mounts", quantity: "24 units", supplier: "Solar Tech Industries" },
            { name: "Drainage System", quantity: "Complete kit", supplier: "RoofDrain Pro" }
        ],
        address: "2468 Ocean View Drive, Malibu, CA 90265",
        owner: {
            name: "David & Lisa Chen",
            phone: "(555) 234-5678",
            email: "chen.residence@email.com"
        },
        completionDate: "January 2026",
        duration: "4 weeks"
    },
    5: {
        title: "Multi-Family Housing Complex",
        description: "Complete roofing solution for a 20-unit apartment complex with durability and cost-efficiency in mind.",
        images: [
            { url: "images/work5.jpg", caption: "Completed Complex", stage: "Final" },
            { url: "images/work5-stage1.jpg", caption: "Project Kickoff", stage: "Planning" },
            { url: "images/work5-stage2.jpg", caption: "Structural Prep", stage: "Preparation" },
            { url: "images/work5-stage3.jpg", caption: "Installation Progress", stage: "Installation" },
            { url: "images/work5-stage4.jpg", caption: "Quality Check", stage: "Finishing" }
        ],
        materials: [
            { name: "Architectural Shingles", quantity: "150 bundles", supplier: "CertainTeed" },
            { name: "Synthetic Underlayment", quantity: "40 rolls", supplier: "Titanium UDL" },
            { name: "Ventilation System", quantity: "50 units", supplier: "Air Vent Inc" },
            { name: "Gutter System", quantity: "800 linear feet", supplier: "Seamless Gutters Co" }
        ],
        address: "1357 Residential Circle, Long Beach, CA 90802",
        owner: {
            name: "Sunrise Property Management",
            phone: "(555) 345-6789",
            email: "projects@sunrisepm.com"
        },
        completionDate: "September 2025",
        duration: "10 weeks"
    },
    6: {
        title: "Luxury Estate - Spanish Tile Roof",
        description: "Premium Spanish tile roof installation for a Mediterranean-style luxury estate with custom color matching.",
        images: [
            { url: "images/work6.jpg", caption: "Completed Estate", stage: "Final" },
            { url: "images/work6-stage1.jpg", caption: "Site Survey", stage: "Planning" },
            { url: "images/work6-stage2.jpg", caption: "Deck Preparation", stage: "Preparation" },
            { url: "images/work6-stage3.jpg", caption: "Tile Placement", stage: "Installation" },
            { url: "images/work6-stage4.jpg", caption: "Custom Finishing", stage: "Finishing" }
        ],
        materials: [
            { name: "Spanish Clay Tiles", quantity: "12,000 tiles", supplier: "Boral Roofing" },
            { name: "Tile Underlayment", quantity: "25 rolls", supplier: "WeatherWatch" },
            { name: "Custom Ridges & Hips", quantity: "300 linear feet", supplier: "Mediterranean Tiles" },
            { name: "Mortar & Adhesive", quantity: "100 bags", supplier: "Mason Supply Co" }
        ],
        address: "9876 Hillcrest Estate Drive, Beverly Hills, CA 90210",
        owner: {
            name: "Robert & Victoria Hampshire",
            phone: "(555) 876-5432",
            email: "hampshire.estate@luxurymail.com"
        },
        completionDate: "February 2026",
        duration: "12 weeks"
    }
};

// Open Project Modal
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const project = projectsData[projectId];
    
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    // Build modal content
    const modalContent = `
        <div class="project-detail">
            <h1 class="project-title">${project.title}</h1>
            <p class="project-description">${project.description}</p>
            
            <div class="project-info-grid">
                <div class="info-card">
                    <h3>📅 Project Timeline</h3>
                    <p><strong>Completed:</strong> ${project.completionDate}</p>
                    <p><strong>Duration:</strong> ${project.duration}</p>
                </div>
                
                <div class="info-card">
                    <h3>📍 Project Location</h3>
                    <p>${project.address}</p>
                </div>
                
                <div class="info-card">
                    <h3>👤 Owner Information</h3>
                    <p><strong>Name:</strong> ${project.owner.name}</p>
                    <p><strong>Phone:</strong> <a href="tel:${project.owner.phone}">${project.owner.phone}</a></p>
                    <p><strong>Email:</strong> <a href="mailto:${project.owner.email}">${project.owner.email}</a></p>
                </div>
            </div>
            
            <h2 class="section-title">📸 Project Gallery - Different Stages</h2>
            <div class="project-gallery">
                ${project.images.map(img => `
                    <div class="project-image">
                        <img src="${img.url}" alt="${img.caption}" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(img.stage)}'">
                        <div class="image-info">
                            <span class="stage-badge">${img.stage}</span>
                            <p>${img.caption}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h2 class="section-title">🔨 Raw Materials Used</h2>
            <div class="materials-list">
                ${project.materials.map(material => `
                    <div class="material-item">
                        <div class="material-header">
                            <h4>${material.name}</h4>
                            <span class="material-quantity">${material.quantity}</span>
                        </div>
                        <p class="material-supplier">Supplier: ${material.supplier}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Project Modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) {
        closeProjectModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProjectModal();
    }
});

// =========================================
// ADMIN PROJECT MANAGEMENT SYSTEM
// =========================================

// Initialize projects storage
function initProjectsStorage() {
    if (!localStorage.getItem('businessProjects')) {
        localStorage.setItem('businessProjects', JSON.stringify({}));
    }
}

// Get all projects
function getAllProjects() {
    const projects = localStorage.getItem('businessProjects');
    return projects ? JSON.parse(projects) : {};
}

// Save project
function saveProject(projectData) {
    try {
        console.log('📦 Getting existing projects...');
        const projects = getAllProjects();
        const projectId = projectData.id || Date.now().toString();
        projectData.id = projectId;
        
        console.log(`💾 Saving project with ID: ${projectId}`);
        projects[projectId] = projectData;
        
        localStorage.setItem('businessProjects', JSON.stringify(projects));
        console.log('✅ Project saved to localStorage successfully');
        
        return projectId;
    } catch (error) {
        console.error('❌ Error in saveProject:', error);
        throw error;
    }
}

// Delete project
function deleteProject(projectId) {
    const projects = getAllProjects();
    delete projects[projectId];
    localStorage.setItem('businessProjects', JSON.stringify(projects));
}

// Load projects list
function loadProjectsList() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    
    const projects = getAllProjects();
    const projectsArray = Object.values(projects);
    
    if (projectsArray.length === 0) {
        projectsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📁</div>
                <h3>No Projects Yet</h3>
                <p>Click "Add New Project" to create your first project</p>
            </div>
        `;
        return;
    }
    
    projectsList.innerHTML = projectsArray.map(project => `
        <div class="project-card">
            <div class="project-header-card">
                <div>
                    <h3>${project.title}</h3>
                    <p class="project-meta">${project.address || 'No address'}</p>
                </div>
                <div class="project-actions">
                    <button class="edit-btn" onclick="editProject('${project.id}')">✏️ Edit</button>
                    <button class="delete-btn" onclick="confirmDeleteProject('${project.id}')">🗑️ Delete</button>
                </div>
            </div>
            <div class="project-summary">
                <div class="summary-item">
                    <span class="label">Owner:</span>
                    <span>${project.owner?.name || 'N/A'}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Completed:</span>
                    <span>${project.completionDate || 'N/A'}</span>
                </div>
                <div class="summary-item">
                    <span class="label">Images:</span>
                    <span>${(project.outputImages?.length || 0) + (project.progressImages?.length || 0) + (project.materialImages?.length || 0)} total</span>
                </div>
                <div class="summary-item">
                    <span class="label">Materials:</span>
                    <span>${project.materials?.length || 0} items</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Add new project button
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin panel JavaScript initialized');
    initProjectsStorage();
    
    const addNewProjectBtn = document.getElementById('addNewProjectBtn');
    if (addNewProjectBtn) {
        addNewProjectBtn.addEventListener('click', function() {
            console.log('➕ Add New Project button clicked');
            openProjectEditModal();
        });
        console.log('✅ Add New Project button event listener attached');
    } else {
        console.error('❌ Add New Project button not found');
    }
    
    // Load projects when the tab is active
    const manageProjectsTab = document.querySelector('[data-tab="manage-projects"]');
    if (manageProjectsTab) {
        manageProjectsTab.addEventListener('click', function() {
            loadProjectsList();
        });
        // Load initially if it's the active tab
        if (manageProjectsTab.classList.contains('active')) {
            loadProjectsList();
        }
    }
    
    // Material add button
    const addMaterialBtn = document.getElementById('addMaterialBtn');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', addMaterialRow);
    }
    
    // Image upload handlers
    setupImagePreview('outputImages', 'outputImagesPreview');
    setupImagePreview('progressImages', 'progressImagesPreview');
    setupImagePreview('materialImages', 'materialImagesPreview');
    
    // Form submission
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
        console.log('✅ Project form event listener attached successfully');
    } else {
        console.error('❌ Project form not found - cannot attach event listener');
    }
});

// Open project edit modal
function openProjectEditModal(projectId = null) {
    console.log('🔓 Opening project edit modal...', projectId ? `Editing project: ${projectId}` : 'Creating new project');
    
    const modal = document.getElementById('projectEditModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('projectForm');
    
    if (!modal || !modalTitle || !form) {
        console.error('❌ Modal elements not found');
        return;
    }
    
    if (projectId) {
        // Edit existing project
        modalTitle.textContent = 'Edit Project';
        const projects = getAllProjects();
        const project = projects[projectId];
        if (project) {
            loadProjectDataIntoForm(project);
        }
    } else {
        // New project
        modalTitle.textContent = 'Add New Project';
        form.reset();
        document.getElementById('projectId').value = '';
        clearMaterialRows();
        clearImagePreviews();
        addMaterialRow(); // Add one empty material row
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    console.log('✅ Modal opened successfully');
}

// Close project edit modal
function closeProjectEditModal() {
    const modal = document.getElementById('projectEditModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Load project data into form
function loadProjectDataIntoForm(project) {
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title || '';
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectDate').value = project.completionDate || '';
    document.getElementById('projectDuration').value = project.duration || '';
    document.getElementById('projectAddress').value = project.address || '';
    document.getElementById('ownerName').value = project.owner?.name || '';
    document.getElementById('ownerPhone').value = project.owner?.phone || '';
    document.getElementById('ownerEmail').value = project.owner?.email || '';
    
    // Load materials
    clearMaterialRows();
    if (project.materials && project.materials.length > 0) {
        project.materials.forEach(material => {
            addMaterialRow(material);
        });
    } else {
        addMaterialRow();
    }
    
    // Load images (display existing as thumbnails)
    displayExistingImages('outputImagesPreview', project.outputImages || []);
    displayExistingImages('progressImagesPreview', project.progressImages || []);
    displayExistingImages('materialImagesPreview', project.materialImages || []);
}

// Display existing images
function displayExistingImages(previewId, images) {
    const preview = document.getElementById(previewId);
    if (!preview) return;
    
    preview.innerHTML = images.map((img, index) => `
        <div class="image-preview-item" data-existing="true" data-index="${index}">
            <img src="${img}" alt="Image ${index + 1}">
            <button type="button" class="remove-image" onclick="removeExistingImage('${previewId}', ${index})">&times;</button>
        </div>
    `).join('');
}

// Remove existing image
function removeExistingImage(previewId, index) {
    const preview = document.getElementById(previewId);
    const items = preview.querySelectorAll('[data-existing="true"]');
    if (items[index]) {
        items[index].remove();
    }
}

// Setup image preview
function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    input.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'image-preview-item';
                    div.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <button type="button" class="remove-image">&times;</button>
                        <p class="image-name">${file.name}</p>
                    `;
                    
                    div.querySelector('.remove-image').addEventListener('click', function() {
                        div.remove();
                    });
                    
                    preview.appendChild(div);
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Clear the input so the same file can be selected again
        input.value = '';
    });
}

// Clear image previews
function clearImagePreviews() {
    ['outputImagesPreview', 'progressImagesPreview', 'materialImagesPreview'].forEach(id => {
        const preview = document.getElementById(id);
        if (preview) preview.innerHTML = '';
    });
}

// Add material row
function addMaterialRow(material = null) {
    const materialsList = document.getElementById('materialsList');
    const row = document.createElement('div');
    row.className = 'material-row';
    row.innerHTML = `
        <input type="text" class="material-name" placeholder="Material name" value="${material?.name || ''}" required>
        <input type="text" class="material-quantity" placeholder="Quantity" value="${material?.quantity || ''}">
        <input type="text" class="material-supplier" placeholder="Supplier" value="${material?.supplier || ''}">
        <button type="button" class="remove-material-btn" onclick="this.parentElement.remove()">×</button>
    `;
    materialsList.appendChild(row);
}

// Clear material rows
function clearMaterialRows() {
    const materialsList = document.getElementById('materialsList');
    if (materialsList) {
        materialsList.innerHTML = '';
    }
}

// Get images from preview
function getImagesFromPreview(previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return [];
    
    const images = [];
    preview.querySelectorAll('.image-preview-item img').forEach(img => {
        images.push(img.src);
    });
    return images;
}

// Handle project form submission
async function handleProjectSubmit(e) {
    e.preventDefault();
    console.log('📝 Form submitted - processing project data...');
    
    try {
        const projectData = {
            id: document.getElementById('projectId').value || Date.now().toString(),
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            completionDate: document.getElementById('projectDate').value,
            duration: document.getElementById('projectDuration').value,
            address: document.getElementById('projectAddress').value,
            owner: {
                name: document.getElementById('ownerName').value,
                phone: document.getElementById('ownerPhone').value,
                email: document.getElementById('ownerEmail').value
            },
            outputImages: getImagesFromPreview('outputImagesPreview'),
            progressImages: getImagesFromPreview('progressImagesPreview'),
            materialImages: getImagesFromPreview('materialImagesPreview'),
            materials: []
        };
        
        // Get materials
        document.querySelectorAll('.material-row').forEach(row => {
            const name = row.querySelector('.material-name').value;
            if (name.trim()) {
                projectData.materials.push({
                    name: name,
                    quantity: row.querySelector('.material-quantity').value,
                    supplier: row.querySelector('.material-supplier').value
                });
            }
        });
        
        console.log('💾 Saving project:', projectData);
        
        // Save project
        const projectId = saveProject(projectData);
        
        console.log('✅ Project saved with ID:', projectId);
        
        // Close modal and reload list
        closeProjectEditModal();
        loadProjectsList();
        
        alert('✅ Project saved successfully!');
    } catch (error) {
        console.error('❌ Error saving project:', error);
        alert('❌ Error saving project: ' + error.message);
    }
}

// Edit project
function editProject(projectId) {
    openProjectEditModal(projectId);
}

// Confirm delete project
function confirmDeleteProject(projectId) {
    const projects = getAllProjects();
    const project = projects[projectId];
    
    if (confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
        deleteProject(projectId);
        loadProjectsList();
        alert('Project deleted successfully!');
    }
}

// Update the main openProjectModal function to load from localStorage
function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    // First try to load from localStorage
    const storedProjects = getAllProjects();
    let project = storedProjects[projectId];
    
    // Fallback to hardcoded data if not found
    if (!project) {
        project = projectsData[projectId];
    }
    
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    // Combine all images for gallery
    const allImages = [];
    
    // Add output images
    if (project.outputImages && project.outputImages.length > 0) {
        project.outputImages.forEach((img, idx) => {
            allImages.push({ url: img, caption: `Output Image ${idx + 1}`, stage: 'Final' });
        });
    }
    
    // Add progress images
    if (project.progressImages && project.progressImages.length > 0) {
        project.progressImages.forEach((img, idx) => {
            allImages.push({ url: img, caption: `Progress Image ${idx + 1}`, stage: 'In Progress' });
        });
    }
    
    // Add material images
    if (project.materialImages && project.materialImages.length > 0) {
        project.materialImages.forEach((img, idx) => {
            allImages.push({ url: img, caption: `Material Image ${idx + 1}`, stage: 'Materials' });
        });
    }
    
    // Fallback to old format
    if (allImages.length === 0 && project.images) {
        allImages.push(...project.images);
    }
    
    // Build modal content
    const modalContent = `
        <div class="project-detail">
            <h1 class="project-title">${project.title}</h1>
            <p class="project-description">${project.description}</p>
            
            <div class="project-info-grid">
                <div class="info-card">
                    <h3>📅 Project Timeline</h3>
                    <p><strong>Completed:</strong> ${project.completionDate || 'N/A'}</p>
                    <p><strong>Duration:</strong> ${project.duration || 'N/A'}</p>
                </div>
                
                <div class="info-card">
                    <h3>📍 Project Location</h3>
                    <p>${project.address}</p>
                </div>
                
                <div class="info-card">
                    <h3>👤 Owner Information</h3>
                    <p><strong>Name:</strong> ${project.owner?.name || 'N/A'}</p>
                    ${project.owner?.phone ? `<p><strong>Phone:</strong> <a href="tel:${project.owner.phone}">${project.owner.phone}</a></p>` : ''}
                    ${project.owner?.email ? `<p><strong>Email:</strong> <a href="mailto:${project.owner.email}">${project.owner.email}</a></p>` : ''}
                </div>
            </div>
            
            ${allImages.length > 0 ? `
                <h2 class="section-title">📸 Project Gallery</h2>
                <div class="project-gallery">
                    ${allImages.map(img => `
                        <div class="project-image">
                            <img src="${img.url}" alt="${img.caption}" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(img.stage || 'Image')}'">
                            <div class="image-info">
                                <span class="stage-badge">${img.stage || 'Image'}</span>
                                <p>${img.caption}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${project.materials && project.materials.length > 0 ? `
                <h2 class="section-title">🔨 Raw Materials Used</h2>
                <div class="materials-list">
                    ${project.materials.map(material => `
                        <div class="material-item">
                            <div class="material-header">
                                <h4>${material.name}</h4>
                                ${material.quantity ? `<span class="material-quantity">${material.quantity}</span>` : ''}
                            </div>
                            ${material.supplier ? `<p class="material-supplier">Supplier: ${material.supplier}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    modalBody.innerHTML = modalContent;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

console.log('✅ Project Management System Loaded');

