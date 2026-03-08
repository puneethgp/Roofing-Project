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

// New Storage logic for Supabase
const pendingImages = {
    outputImages: [],
    progressImages: [],
    materialImages: []
};

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
        
        if (targetTab === 'upload-materials') {
            loadExistingMaterials();
        }
    });
});

// Work Files Upload
if (workFilesInput) {
    workFilesInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileUpload(files, 'work');
    });
}

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
if (saveWorkImagesBtn) {
    saveWorkImagesBtn.addEventListener('click', () => {
        if (workFiles.length === 0) return;
        
        showInstructions('work', workFiles);
    });
}

// Save Material Images to Cloud
saveMaterialImagesBtn.addEventListener('click', async () => {
    if (!supabase) return;
    
    const totalFiles = ceilingTilesFiles.length + roofTilesFiles.length + fabricationFiles.length;
    
    if (totalFiles === 0) {
        alert('Please upload at least one material image in any category!');
        return;
    }
    
    try {
        saveMaterialImagesBtn.disabled = true;
        saveMaterialImagesBtn.textContent = '⏳ Uploading to Cloud...';
        
        // 1. Fetch existing materials from cloud to append to
        const { data: existingData, error: fetchError } = await supabase
            .from('global_settings')
            .select('value')
            .eq('key', 'material_categories')
            .single();
            
        let materialsData = existingData ? existingData.value : {
            ceilingTiles: [],
            roofTiles: [],
            fabrication: []
        };
        
        // 2. Upload and get URLs
        console.log('🏗️ Uploading ceiling tiles...');
        const ceilingUrls = await Promise.all(
            ceilingTilesFiles.map(file => uploadToSupabase(file, 'global/ceiling'))
        );
        materialsData.ceilingTiles.push(...ceilingUrls.map(url => ({ url, name: 'Ceiling Tile' })));
        
        console.log('🏠 Uploading roof tiles...');
        const roofUrls = await Promise.all(
            roofTilesFiles.map(file => uploadToSupabase(file, 'global/roof'))
        );
        materialsData.roofTiles.push(...roofUrls.map(url => ({ url, name: 'Roof Tile' })));
        
        console.log('🔧 Uploading fabrication materials...');
        const fabricationUrls = await Promise.all(
            fabricationFiles.map(file => uploadToSupabase(file, 'global/fabrication'))
        );
        materialsData.fabrication.push(...fabricationUrls.map(url => ({ url, name: 'Fabrication Material' })));
        
        // 3. Save back to database
        const { error: saveError } = await supabase
            .from('global_settings')
            .upsert({ key: 'material_categories', value: materialsData });
            
        if (saveError) throw saveError;
        
        alert(`✅ Successfully uploaded ${totalFiles} images to the cloud!`);
        
        // Clear inputs
        ceilingTilesFiles = []; roofTilesFiles = []; fabricationFiles = [];
        ceilingTilesPreview.innerHTML = ''; roofTilesPreview.innerHTML = ''; fabricationPreview.innerHTML = '';
        if (ceilingTilesInput) ceilingTilesInput.value = '';
        if (roofTilesInput) roofTilesInput.value = '';
        if (fabricationInput) fabricationInput.value = '';
        updateMaterialSaveButton();
        loadImageCounts();
        
    } catch (error) {
        console.error('❌ Cloud Material Upload Error:', error);
        alert('❌ Error uploading materials: ' + error.message);
    } finally {
        saveMaterialImagesBtn.disabled = false;
        saveMaterialImagesBtn.textContent = 'Save All Material Images';
    }
});

// Show Instructions
function showInstructions(type, files) {
    const fileList = files.map((file, index) => {
        const suggestedName = type === 'work' ? `work${index + 1}.jpg` : `material${index + 1}.jpg`;
        return `  • ${file.name} → Rename to: ${suggestedName}`;
    }).join('\n');
    
    const folder = type === 'work' ? 'work portfolio' : 'raw materials';
    
    alert(`📸 Images Ready to Save!\n\n${files.length} image(s) selected for ${folder}.\n\nInstructions:\n\n1. Manually save these files to the 'assets/images/' folder:\n\n${fileList}\n\n2. Make sure to rename them exactly as shown above.\n\n3. Refresh your main website to see the changes!\n\nNote: Since this is a static website without a backend server, you need to manually copy the files. For automatic uploads, you would need to add a backend server (PHP, Node.js, etc.).`);
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
            { url: "assets/images/work1.jpg", caption: "Completed Project", stage: "Final" },
            { url: "assets/images/work1-stage1.jpg", caption: "Initial Assessment", stage: "Planning" },
            { url: "assets/images/work1-stage2.jpg", caption: "Foundation Work", stage: "Foundation" },
            { url: "assets/images/work1-stage3.jpg", caption: "Installation Phase", stage: "Installation" },
            { url: "assets/images/work1-stage4.jpg", caption: "Finishing Touches", stage: "Finishing" }
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
            { url: "assets/images/work2.jpg", caption: "Completed Project", stage: "Final" },
            { url: "assets/images/work2-stage1.jpg", caption: "Site Inspection", stage: "Planning" },
            { url: "assets/images/work2-stage2.jpg", caption: "Old Roof Removal", stage: "Demolition" },
            { url: "assets/images/work2-stage3.jpg", caption: "New Structure Install", stage: "Installation" },
            { url: "assets/images/work2-stage4.jpg", caption: "Final Inspection", stage: "Finishing" }
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
            { url: "assets/images/work3.jpg", caption: "Completed Restoration", stage: "Final" },
            { url: "assets/images/work3-stage1.jpg", caption: "Original Roof Assessment", stage: "Planning" },
            { url: "assets/images/work3-stage2.jpg", caption: "Careful Demolition", stage: "Demolition" },
            { url: "assets/images/work3-stage3.jpg", caption: "Custom Installation", stage: "Installation" },
            { url: "assets/images/work3-stage4.jpg", caption: "Period Details Added", stage: "Finishing" }
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
            { url: "assets/images/work4.jpg", caption: "Completed Project", stage: "Final" },
            { url: "assets/images/work4-stage1.jpg", caption: "Design Planning", stage: "Planning" },
            { url: "assets/images/work4-stage2.jpg", caption: "Membrane Installation", stage: "Installation" },
            { url: "assets/images/work4-stage3.jpg", caption: "Solar Integration", stage: "Solar" },
            { url: "assets/images/work4-stage4.jpg", caption: "Final Waterproofing", stage: "Finishing" }
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
            { url: "assets/images/work5.jpg", caption: "Completed Complex", stage: "Final" },
            { url: "assets/images/work5-stage1.jpg", caption: "Project Kickoff", stage: "Planning" },
            { url: "assets/images/work5-stage2.jpg", caption: "Structural Prep", stage: "Preparation" },
            { url: "assets/images/work5-stage3.jpg", caption: "Installation Progress", stage: "Installation" },
            { url: "assets/images/work5-stage4.jpg", caption: "Quality Check", stage: "Finishing" }
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
            { url: "assets/images/work6.jpg", caption: "Completed Estate", stage: "Final" },
            { url: "assets/images/work6-stage1.jpg", caption: "Site Survey", stage: "Planning" },
            { url: "assets/images/work6-stage2.jpg", caption: "Deck Preparation", stage: "Preparation" },
            { url: "assets/images/work6-stage3.jpg", caption: "Tile Placement", stage: "Installation" },
            { url: "assets/images/work6-stage4.jpg", caption: "Custom Finishing", stage: "Finishing" }
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

// Initialize projects storage (No longer needed for LocalStorage, but keeping for compatibility)
function initProjectsStorage() {
    console.log('☁️ Using Supabase storage instead of LocalStorage');
}

// Get all projects from Supabase
async function getAllProjects() {
    if (!supabase) return {};
    
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        // Convert array to object format for compatibility with existing code
        const projectsObj = {};
        data.forEach(p => { 
            projectsObj[p.id] = {
                ...p,
                completionDate: p.completiondate || p.completionDate || '',
                outputImages: p.outputimages || p.outputImages || [],
                progressImages: p.progressimages || p.progressImages || [],
                materialImages: p.materialimages || p.materialImages || []
            }; 
        });
        return projectsObj;
    } catch (error) {
        console.error('❌ Error fetching projects from Supabase:', error);
        return {};
    }
}

// Helper to upload a single image to Supabase Storage
async function uploadToSupabase(file, folder) {
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);
        
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);
        
    return publicUrl;
}

// Save project to Supabase
async function saveProject(projectData) {
    if (!supabase) throw new Error('Supabase not connected');
    
    try {
        console.log('🚀 Uploading new images to Cloud Storage...');
        
        // 1. Upload new output images
        const newOutputUrls = await Promise.all(
            pendingImages.outputImages.map(file => uploadToSupabase(file, 'output'))
        );
        projectData.outputImages = [...(projectData.outputImages || []), ...newOutputUrls];
        
        // 2. Upload new progress images
        const newProgressUrls = await Promise.all(
            pendingImages.progressImages.map(file => uploadToSupabase(file, 'progress'))
        );
        projectData.progressImages = [...(projectData.progressImages || []), ...newProgressUrls];
        
        // 3. Upload new material images
        const newMaterialUrls = await Promise.all(
            pendingImages.materialImages.map(file => uploadToSupabase(file, 'materials'))
        );
        projectData.materialImages = [...(projectData.materialImages || []), ...newMaterialUrls];

        console.log('💾 Saving project data to Database...');
        
        // Check if updating or inserting
        const isUpdate = !!document.getElementById('projectId').value;
        let result;
        
        // Map to lowercase to avoid PostgreSQL schema case sensitivity issues
        const dbData = {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            address: projectData.address,
            duration: String(projectData.duration || ''),
            completiondate: String(projectData.completionDate || ''),
            owner: projectData.owner,
            outputimages: projectData.outputImages || [],
            progressimages: projectData.progressImages || [],
            materialimages: projectData.materialImages || [],
            materials: projectData.materials || []
        };
        
        if (isUpdate) {
            result = await supabase
                .from('projects')
                .update(dbData)
                .eq('id', dbData.id);
        } else {
            // Delete the undefined/empty id so Postgres can generate the UUID automatically
            delete dbData.id;
            result = await supabase
                .from('projects')
                .insert([dbData]);
        }
        
        if (result.error) throw result.error;
        
        // Clear pending images after success
        pendingImages.outputImages = [];
        pendingImages.progressImages = [];
        pendingImages.materialImages = [];
        
        return projectData.id;
    } catch (error) {
        console.error('❌ Error in cloud saveProject:', error);
        throw error;
    }
}

// Delete project from Supabase
async function deleteProject(projectId) {
    if (!supabase) return;
    try {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);
            
        if (error) throw error;
    } catch (error) {
        console.error('❌ Error deleting project:', error);
        throw error;
    }
}

// Load projects list
async function loadProjectsList() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    
    projectsList.innerHTML = '<div class="loading">⏳ Fetching your projects from the cloud...</div>';
    
    const projects = await getAllProjects();
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
    
    projectsList.innerHTML = projectsArray.map(project => {
        const previewUrl = (project.outputImages && project.outputImages.length > 0) ? project.outputImages[0] : 
                           ((project.progressImages && project.progressImages.length > 0) ? project.progressImages[0] : 
                           ((project.materialImages && project.materialImages.length > 0) ? project.materialImages[0] : 'https://via.placeholder.com/150'));
        return `
        <div class="project-card">
            <div class="project-header-card">
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${previewUrl}" alt="Preview" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div>
                        <h3>${project.title}</h3>
                        <p class="project-meta">${project.address || 'No address'}</p>
                    </div>
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
    `}).join('');
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
    // Load existing materials if tab is active
    const materialsTab = document.querySelector('[data-tab="upload-materials"]');
    if (materialsTab && materialsTab.classList.contains('active')) {
        loadExistingMaterials();
    }

    // Load projects when the tab is active
    const manageProjectsTab = document.querySelector('[data-tab="manage-projects"]');
    if (manageProjectsTab) {
        manageProjectsTab.addEventListener('click', async function() {
            await loadProjectsList();
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
async function openProjectEditModal(projectId = null) {
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
        const projects = await getAllProjects();
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
                // Store the file object for later upload
                if (inputId === 'outputImages') pendingImages.outputImages.push(file);
                if (inputId === 'progressImages') pendingImages.progressImages.push(file);
                if (inputId === 'materialImages') pendingImages.materialImages.push(file);

                const reader = new FileReader();
                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'image-preview-item';
                    div.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <button type="button" class="remove-image" data-name="${file.name}">&times;</button>
                        <p class="image-name">${file.name}</p>
                    `;
                    
                    div.querySelector('.remove-image').addEventListener('click', function() {
                        const name = this.getAttribute('data-name');
                        // Remove from pending list
                        if (inputId === 'outputImages') pendingImages.outputImages = pendingImages.outputImages.filter(f => f.name !== name);
                        if (inputId === 'progressImages') pendingImages.progressImages = pendingImages.progressImages.filter(f => f.name !== name);
                        if (inputId === 'materialImages') pendingImages.materialImages = pendingImages.materialImages.filter(f => f.name !== name);
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

// Get existing image URLs from preview (those already in Supabase)
function getExistingImagesFromPreview(previewId) {
    const preview = document.getElementById(previewId);
    if (!preview) return [];
    
    const images = [];
    preview.querySelectorAll('.image-preview-item[data-existing="true"] img').forEach(img => {
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
            id: document.getElementById('projectId').value || undefined, // Use undefined for auto-uuid on insert
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
            outputImages: getExistingImagesFromPreview('outputImagesPreview'),
            progressImages: getExistingImagesFromPreview('progressImagesPreview'),
            materialImages: getExistingImagesFromPreview('materialImagesPreview'),
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
        const projectId = await saveProject(projectData);
        
        console.log('✅ Project saved with ID:', projectId);
        
        // Close modal and reload list
        closeProjectEditModal();
        await loadProjectsList();
        
        alert('✅ Project saved successfully!');
    } catch (error) {
        console.error('❌ Error saving project:', error);
        alert('❌ Error saving project: ' + error.message);
    }
}

// Edit project
async function editProject(projectId) {
    await openProjectEditModal(projectId);
}

// Confirm delete project
async function confirmDeleteProject(projectId) {
    const projects = await getAllProjects();
    const project = projects[projectId];
    
    if (confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
        await deleteProject(projectId);
        await loadProjectsList();
        alert('Project deleted successfully!');
    }
}

// Update the main openProjectModal function to load from cloud storage
async function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    
    // First try to load from cloud storage
    const storedProjects = await getAllProjects();
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



// Load existing materials
async function loadExistingMaterials() {
    if (!supabase) return;
    try {
        const { data, error } = await supabase
            .from('global_settings')
            .select('value')
            .eq('key', 'material_categories')
            .single();
            
        if (error && error.code !== 'PGRST116') throw error;
        
        let materialsData = data ? data.value : { ceilingTiles: [], roofTiles: [], fabrication: [] };
        
        renderExistingMaterials('existingCeilingTiles', materialsData.ceilingTiles || [], 'ceilingTiles');
        renderExistingMaterials('existingRoofTiles', materialsData.roofTiles || [], 'roofTiles');
        renderExistingMaterials('existingFabrication', materialsData.fabrication || [], 'fabrication');
        
    } catch (e) {
        console.error("Error loading existing materials:", e);
    }
}

function renderExistingMaterials(containerId, items, category) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; color: #666; font-size: 14px;">No images uploaded yet.</p>';
        return;
    }
    
    container.innerHTML = items.map((item, idx) => `
        <div class="preview-item">
            <img src="${item.url}" alt="${item.name || 'Material image'}">
            <button class="remove-btn" onclick="deleteExistingMaterial('${category}', ${idx})" title="Delete image">×</button>
            <div class="preview-info">
                <p><strong>Name:</strong> ${item.name || 'Material'}</p>
            </div>
        </div>
    `).join('');
}

async function deleteExistingMaterial(category, index) {
    if (!confirm('Are you sure you want to delete this material image?')) return;
    
    try {
        const { data, error } = await supabase
            .from('global_settings')
            .select('value')
            .eq('key', 'material_categories')
            .single();
            
        if (error) throw error;
        
        let materialsData = data.value;
        if (materialsData && materialsData[category]) {
            materialsData[category].splice(index, 1);
            
            const { error: updateError } = await supabase
                .from('global_settings')
                .update({ value: materialsData })
                .eq('key', 'material_categories');
                
            if (updateError) throw updateError;
            
            // Reload
            loadExistingMaterials();
            alert('Image deleted successfully!');
        }
    } catch (e) {
        console.error('Error deleting material image:', e);
        alert('Failed to delete image: ' + e.message);
    }
}

async function loadLeadsList() {
    const leadsList = document.getElementById('leadsList');
    if (!leadsList || !supabase) return;
    try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', {ascending: false});
        if (error) throw error;
        
        if (!data || data.length === 0) {
            leadsList.innerHTML = '<div class="empty-state"><h3>No Leads Yet</h3></div>';
            return;
        }
        
        leadsList.innerHTML = data.map(lead => `
            <div class="project-card" style="margin-bottom: 15px; border-left: 5px solid ${getStatusColor(lead.status)}">
                <div class="project-header-card" style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <h3 style="margin:0;">${lead.name}</h3>
                        <p class="project-meta">${new Date(lead.created_at).toLocaleString()}</p>
                    </div>
                    <div class="lead-actions" style="display:flex; gap:10px;">
                        <a href="tel:${lead.phone}" class="edit-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px;">📞 Call</a>
                        <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" target="_blank" class="edit-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px; background:#25D366; color:white; border-color:#25D366;">💬 WhatsApp</a>
                    </div>
                </div>
                <div class="project-summary" style="display:block; margin-top:15px;">
                    <p><strong>Phone:</strong> ${lead.phone}</p>
                    <p><strong>Email:</strong> ${lead.email || 'N/A'}</p>
                    <p style="margin-top:10px; color:var(--text-muted);"><strong>Requirement:</strong><br>${lead.requirement}</p>
                    
                    <div style="margin-top:20px; padding-top:15px; border-top:1px solid var(--border); display:flex; align-items:center; gap:15px;">
                        <span class="label">Update Status:</span>
                        <select onchange="updateLeadStatus('${lead.id}', this.value)" style="width: auto; margin-bottom: 0; padding: 5px 10px;">
                            <option value="New" ${lead.status === 'New' ? 'selected' : ''}>New Request</option>
                            <option value="In Progress" ${lead.status === 'In Progress' ? 'selected' : ''}>In Progress / Ongoing</option>
                            <option value="Need to Call" ${lead.status === 'Need to Call' ? 'selected' : ''}>Need to Call</option>
                            <option value="Completed" ${lead.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" ${lead.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <span class="status-badge" style="background:${getStatusColor(lead.status)}; color:#111; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:600;">${lead.status || 'New'}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch(e) {
        console.error("Error loading leads", e);
        leadsList.innerHTML = `<div class="empty-state"><h3 style="color: #ff4d4f;">Error loading leads</h3><p>${e.message}</p></div>`;
    }
}

function getStatusColor(status) {
    switch(status) {
        case 'New': return '#ffb020'; // Accent yellow
        case 'In Progress': return '#3498db'; // Blue
        case 'Need to Call': return '#e67e22'; // Orange
        case 'Completed': return '#2ecc71'; // Green
        case 'Cancelled': return '#e74c3c'; // Red
        default: return '#ffb020';
    }
}

async function updateLeadStatus(id, newStatus) {
    try {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', id);
            
        if (error) throw error;
        loadLeadsList(); // Refresh
    } catch (e) {
        alert('Failed to update status: ' + e.message);
    }
}

// Hook leads to tab
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            if(btn.getAttribute('data-tab') === 'manage-leads') {
                loadLeadsList();
            }
        });
    });
});
