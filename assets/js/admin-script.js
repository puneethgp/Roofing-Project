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
        loadManageContent(); // Load content when logging in
    } else {
        loginError.textContent = 'Invalid password. Please try again.';
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
        } else if (targetTab === 'manage-content') {
            loadManageContent();
        } else if (targetTab === 'manage-leads') {
            loadLeadsList();
        } else if (targetTab === 'manage-projects') {
            loadProjectsList();
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
if (saveMaterialImagesBtn) {
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
            
        } catch (error) {
            console.error('❌ Cloud Material Upload Error:', error);
            alert('❌ Error uploading materials: ' + error.message);
        } finally {
            saveMaterialImagesBtn.disabled = false;
            saveMaterialImagesBtn.textContent = 'Save All Material Images';
        }
    });
}

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
const changePasswordBtn = document.getElementById('changePasswordBtn');
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
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
}



// Drag and Drop Support
function setupDragAndDrop(element, type) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.style.borderColor = 'var(--gold-leaf-accent)';
        element.style.background = 'var(--surface)';
    });
    
    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.style.borderColor = 'var(--border)';
        element.style.background = 'var(--bg)';
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.style.borderColor = 'var(--border)';
        element.style.background = 'var(--bg)';
        
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
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-leaf-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Project Timeline</h3>
                    <p><strong>Completed:</strong> ${project.completionDate}</p>
                    <p><strong>Duration:</strong> ${project.duration}</p>
                </div>
                
                <div class="info-card">
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-leaf-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Project Location</h3>
                    <p>${project.address}</p>
                </div>
                
                <div class="info-card">
                    <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-leaf-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Owner Information</h3>
                    <p><strong>Name:</strong> ${project.owner.name}</p>
                    <p><strong>Phone:</strong> <a href="tel:${project.owner.phone}">${project.owner.phone}</a></p>
                    <p><strong>Email:</strong> <a href="mailto:${project.owner.email}">${project.owner.email}</a></p>
                </div>
            </div>
            
            <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-leaf-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; vertical-align:middle;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Project Gallery - Different Stages</h2>
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
            
            <h2 class="section-title"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold-leaf-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:10px; vertical-align:middle;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg> Raw Materials Used</h2>
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
    
    if (modalBody) modalBody.innerHTML = modalContent;
    if (modal) modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Project Modal
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.style.display = 'none';
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
                <div class="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--gold-leaf-accent)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                </div>
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

// Add material Row
function addMaterialRow(material = null) {
    const materialsList = document.getElementById('materialsList');
    if (!materialsList) return;
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

// Display Project Modal
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
    
    if (modalBody) modalBody.innerHTML = modalContent;
    if (modal) modal.style.display = 'flex';
}

// Manage Materials
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
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
        const { data, error } = await supabase
            .from('global_settings')
            .select('value')
            .eq('key', 'material_categories')
            .single();
            
        if (error) throw error;
        
        let materialsData = data.value;
        if (materialsData[category]) {
            materialsData[category].splice(index, 1);
            
            const { error: saveError } = await supabase
                .from('global_settings')
                .upsert({ key: 'material_categories', value: materialsData });
                
            if (saveError) throw saveError;
            
            alert('✅ Material deleted successfully!');
            loadExistingMaterials(); // Refresh
        }
    } catch (e) {
        console.error("Error deleting material:", e);
        alert('❌ Error deleting material: ' + e.message);
    }
}

// Leads Management
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
                        <a href="tel:${lead.phone}" class="edit-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.82 12.82 0 0 0 .63 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.63A2 2 0 0 1 22 16.92z"></path></svg>
                            Call
                        </a>
                        <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" target="_blank" class="edit-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:5px; background:#25D366; color:white; border-color:#25D366;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            WhatsApp
                        </a>
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
        case 'New': return '#ffb020'; 
        case 'In Progress': return '#3498db'; 
        case 'Need to Call': return '#e67e22'; 
        case 'Completed': return '#2ecc71'; 
        case 'Cancelled': return '#e74c3c'; 
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

// --- Manage Content (Pricing & Business Info) ---

function getLocalContent() {
    return JSON.parse(localStorage.getItem('roofing_manage_content') || '{}');
}

async function loadManageContent() {
    const fields = ['basePriceSqft', 'businessName', 'tagline', 'address', 'email', 'phone', 'hours'];
    
    // 1. Load from LocalStorage first (Instant)
    const localData = getLocalContent();
    const localPrice = localStorage.getItem('roofing_standard_price');
    
    if (localPrice && document.getElementById('basePriceSqft')) {
        document.getElementById('basePriceSqft').value = localPrice;
    }
    
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && localData[id]) {
            el.value = localData[id];
        }
    });

    if (!supabase) return;

    try {
        console.log("🔄 Loading content from Supabase...");
        const { data, error } = await supabase
            .from('global_settings')
            .select('*');

        if (error) throw error;
        
        const settings = {};
        data.forEach(item => {
            settings[item.key] = item.value;
        });

        // Update Price from Cloud History
        const { data: priceData, error: priceError } = await supabase
            .from('pricing_history')
            .select('price_per_sqft, created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (!priceError && priceData) {
            const val = priceData.price_per_sqft;
            const priceInput = document.getElementById('basePriceSqft');
            if (priceInput) priceInput.value = val;
            localStorage.setItem('roofing_standard_price', val);
            
            const timestampEl = document.getElementById('priceTimestamp');
            if (timestampEl) {
                const date = new Date(priceData.created_at);
                timestampEl.innerText = `Last updated: ${date.toLocaleString()}`;
            }
        } else if (settings['standard_price_per_sqft']) {
            // Fallback to legacy field
            const val = typeof settings['standard_price_per_sqft'] === 'object' ? settings['standard_price_per_sqft'].price : settings['standard_price_per_sqft'];
            const priceInput = document.getElementById('basePriceSqft');
            if (priceInput) priceInput.value = val;
            localStorage.setItem('roofing_standard_price', val);
        }

        // Update Business Info from Cloud
        const businessInfo = settings['business_info'] || {};
        const cloudMapping = {
            'businessName': businessInfo.name,
            'tagline': businessInfo.tagline,
            'address': businessInfo.address,
            'email': businessInfo.email,
            'phone': businessInfo.phone,
            'hours': businessInfo.hours
        };

        Object.keys(cloudMapping).forEach(id => {
            const el = document.getElementById(id);
            if (el && cloudMapping[id]) {
                el.value = cloudMapping[id];
                localData[id] = cloudMapping[id];
            }
        });
        
        localStorage.setItem('roofing_manage_content', JSON.stringify(localData));

    } catch (e) {
        console.warn("Could not load from cloud, using local data:", e);
    }
}

async function saveManageContent() {
    const saveBtn = document.getElementById('saveContentBtn');
    if (!saveBtn) return;

    try {
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Saving...';

        const dataToSave = {
            basePriceSqft: document.getElementById('basePriceSqft')?.value,
            businessName: document.getElementById('businessName')?.value,
            tagline: document.getElementById('tagline')?.value,
            address: document.getElementById('address')?.value,
            email: document.getElementById('email')?.value,
            phone: document.getElementById('phone')?.value,
            hours: document.getElementById('hours')?.value
        };

        // 1. Save Locally
        localStorage.setItem('roofing_manage_content', JSON.stringify(dataToSave));
        if (dataToSave.basePriceSqft) {
            localStorage.setItem('roofing_standard_price', dataToSave.basePriceSqft);
        }

        if (!supabase) {
            alert("✅ Saved locally. (Supabase not connected)");
            return;
        }

        // 2. Save to Cloud
        const now = new Date().toISOString();
        
        // A. Update History Table (New Request)
        const { error: historyError } = await supabase
            .from('pricing_history')
            .insert([{ 
                price_per_sqft: parseFloat(dataToSave.basePriceSqft),
                metadata: { source: 'admin_panel' }
            }]);

        if (historyError) console.warn("Could not save to history table:", historyError);

        // B. Update Global Settings (Redundant but keeps both in sync)
        const updates = [
            { 
                key: 'standard_price_per_sqft', 
                value: { 
                    price: parseFloat(dataToSave.basePriceSqft),
                    updatedAt: now
                } 
            },
            {
                key: 'business_info',
                value: {
                    name: dataToSave.businessName,
                    tagline: dataToSave.tagline,
                    address: dataToSave.address,
                    email: dataToSave.email,
                    phone: dataToSave.phone,
                    hours: dataToSave.hours,
                    updatedAt: now
                }
            }
        ];

        const { error } = await supabase
            .from('global_settings')
            .upsert(updates);

        if (error) throw error;
        
        // Update timestamp display
        const timestampEl = document.getElementById('priceTimestamp');
        if (timestampEl) {
            timestampEl.innerText = `Last updated: ${new Date(now).toLocaleString()}`;
        }

        alert("✅ All changes saved successfully to cloud!");
        
        // Refresh local UI to show any formatted results from cloud
        loadManageContent();
    } catch (e) {
        console.error("Error saving content:", e);
        alert("❌ Saved locally, but failed to sync with cloud: " + e.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
    }
}

// Function to apply business info and pricing to any page (Used by index.html etc.)
async function applyDynamicContent() {
    if (typeof supabase === 'undefined') return;
    
    try {
        const { data, error } = await supabase.from('global_settings').select('*');
        if (error) throw error;
        
        const settings = {};
        data.forEach(item => settings[item.key] = item.value);
        
        const info = settings['business_info'] || {};
        
        // Update Brand/Logo
        if (info.name) {
            document.querySelectorAll('.logo').forEach(el => el.innerText = info.name);
            document.title = `${info.name} - Portfolio & Services`;
        }
        
        // Update Hero Title/Tagline
        if (info.name && document.querySelector('.hero-content h1')) {
            document.querySelector('.hero-content h1').innerText = `Welcome to ${info.name}`;
        }
        if (info.tagline && document.querySelector('.hero-content p')) {
            document.querySelector('.hero-content p').innerText = info.tagline;
        }
        
        // Update Footer Description
        if (info.tagline && document.querySelector('.footer-brand p')) {
            document.querySelector('.footer-brand p').innerText = `Providing premium roofing solutions with ${info.tagline}. Quality, durability, and craftsmanship.`;
        }
        
        // Update Contact Details
        if (info.address) {
            document.querySelectorAll('.address-display').forEach(el => el.innerText = info.address);
            // Example replacement if using specific structure
            const addressItems = document.querySelectorAll('.info-item, .footer-contact-item');
            addressItems.forEach(item => {
                const h3 = item.querySelector('h3');
                if (h3 && h3.innerText.includes('Address')) {
                    const p = item.querySelector('p');
                    if (p) p.innerText = info.address;
                } else if (item.innerHTML.includes('path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"')) {
                    const p = item.querySelector('p');
                    if (p) p.innerText = info.address;
                }
            });
        }
        
        if (info.email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
                a.href = `mailto:${info.email}`;
                a.innerText = info.email;
            });
        }
        
        if (info.phone) {
            document.querySelectorAll('a[href^="tel:"]').forEach(a => {
                const cleanPhone = info.phone.replace(/[^0-9+]/g, '');
                a.href = `tel:${cleanPhone}`;
                a.innerText = info.phone;
            });
        }
        
        if (info.hours) {
            const hourItems = document.querySelectorAll('.info-item, .footer-section');
            hourItems.forEach(item => {
                const h3 = item.querySelector('h3, .footer-heading');
                if (h3 && h3.innerText.includes('Hours')) {
                    const p = item.querySelector('p');
                    if (p) p.innerText = info.hours;
                }
            });
        }

        // --- NEW: Handle Mobile-Only / Visual Authority Dynamic Content ---
        if (info.name) {
            // Update "Irfaaz Roofing Masterpiece" text in mobile section
            document.querySelectorAll('.visual-authority .fade-up').forEach(el => {
                if (el.tagName === 'SPAN' && el.innerText.toLowerCase().includes('roofing masterpiece')) {
                    el.innerText = `${info.name} Masterpiece`;
                }
            });
        }
        
        if (info.tagline) {
            // Update "Precision in Every Shingle" if we want tagline there instead
            const visualH2 = document.querySelector('.visual-authority h2');
            if (visualH2) {
                // If it's a new tagline, we could use it here or keep the hardcoded "Precision" one
                // For now, let's keep it robust
            }
        }

        // Apply Price to Specific Displays if needed (Handled by fetchCurrentPrice usually)
    } catch (e) {
        console.error("Dynamic content application failed", e);
    }
}

// Final Global Hooks
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveContentBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveManageContent();
        });
    }
    
    if (typeof isAuthenticated !== 'undefined' && isAuthenticated) {
        loadManageContent();
        loadProjectsList();
    }

    // --- Project Management Listeners ---
    const addNewProjectBtn = document.getElementById('addNewProjectBtn');
    if (addNewProjectBtn) {
        addNewProjectBtn.addEventListener('click', () => {
            resetProjectForm();
            document.getElementById('modalTitle').innerText = 'Add New Project';
            document.getElementById('projectEditModal').style.display = 'flex';
        });
    }

    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = projectForm.querySelector('button[type="submit"]');
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = '⏳ Saving...';
                
                const projectData = {
                    id: document.getElementById('projectId').value || null,
                    title: document.getElementById('projectTitle').value,
                    description: document.getElementById('projectDescription').value,
                    address: document.getElementById('projectAddress').value,
                    completionDate: document.getElementById('projectDate').value,
                    duration: document.getElementById('projectDuration').value,
                    owner: {
                        name: document.getElementById('ownerName').value,
                        phone: document.getElementById('ownerPhone').value,
                        email: document.getElementById('ownerEmail').value
                    },
                    materials: Array.from(document.querySelectorAll('.material-row')).map(row => ({
                        name: row.querySelector('.material-name').value,
                        quantity: row.querySelector('.material-quantity').value,
                        supplier: row.querySelector('.material-supplier').value
                    }))
                };
                
                // If it's an update, we need to pass along existing image arrays
                // (In a real app, you'd manage this better, but let's keep it simple)
                if (projectData.id) {
                    const allProjects = await getAllProjects();
                    const existing = allProjects[projectData.id];
                    if (existing) {
                        projectData.outputImages = existing.outputImages || [];
                        projectData.progressImages = existing.progressImages || [];
                        projectData.materialImages = existing.materialImages || [];
                    }
                }
                
                await saveProject(projectData);
                alert('✅ Project saved successfully!');
                closeProjectEditModal();
                loadProjectsList();
            } catch (err) {
                console.error('Error saving project:', err);
                alert('❌ Error saving project: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Save Project';
            }
        });
    }

    const addMaterialBtn = document.getElementById('addMaterialBtn');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', () => addMaterialRow());
    }

    // Image Input Previews
    const imageInputs = [
        { id: 'outputImages', previewId: 'outputImagesPreview', type: 'outputImages' },
        { id: 'progressImages', previewId: 'progressImagesPreview', type: 'progressImages' },
        { id: 'materialImages', previewId: 'materialImagesPreview', type: 'materialImages' }
    ];

    imageInputs.forEach(input => {
        const el = document.getElementById(input.id);
        const previewEl = document.getElementById(input.previewId);
        if (el && previewEl) {
            el.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                pendingImages[input.type] = files;
                
                previewEl.innerHTML = '';
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (re) => {
                        const img = document.createElement('img');
                        img.src = re.target.result;
                        img.style.width = '60px';
                        img.style.height = '60px';
                        img.style.objectFit = 'cover';
                        img.style.borderRadius = '4px';
                        previewEl.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            });
        }
    });
});

function resetProjectForm() {
    const form = document.getElementById('projectForm');
    if (form) form.reset();
    document.getElementById('projectId').value = '';
    document.getElementById('materialsList').innerHTML = '';
    document.getElementById('outputImagesPreview').innerHTML = '';
    document.getElementById('progressImagesPreview').innerHTML = '';
    document.getElementById('materialImagesPreview').innerHTML = '';
    pendingImages.outputImages = [];
    pendingImages.progressImages = [];
    pendingImages.materialImages = [];
}

function closeProjectEditModal() {
    document.getElementById('projectEditModal').style.display = 'none';
}

async function editProject(projectId) {
    resetProjectForm();
    const allProjects = await getAllProjects();
    const project = allProjects[projectId];
    
    if (!project) return;
    
    document.getElementById('modalTitle').innerText = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('projectTitle').value = project.title || '';
    document.getElementById('projectDescription').value = project.description || '';
    document.getElementById('projectAddress').value = project.address || '';
    document.getElementById('projectDate').value = project.completionDate || '';
    document.getElementById('projectDuration').value = project.duration || '';
    document.getElementById('ownerName').value = project.owner?.name || '';
    document.getElementById('ownerPhone').value = project.owner?.phone || '';
    document.getElementById('ownerEmail').value = project.owner?.email || '';
    
    if (project.materials && project.materials.length > 0) {
        project.materials.forEach(m => addMaterialRow(m));
    }
    
    document.getElementById('projectEditModal').style.display = 'flex';
}

async function confirmDeleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        try {
            await deleteProject(projectId);
            alert('✅ Project deleted successfully!');
            loadProjectsList();
        } catch (err) {
            alert('❌ Error deleting project: ' + err.message);
        }
    }
}
