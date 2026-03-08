import re
import os

base_dir = r"c:\Users\megha\Puneeth\FirstclaudeProject\Roofing-Project"
admin_html_path = os.path.join(base_dir, "admin.html")
admin_js_path = os.path.join(base_dir, "assets", "js", "admin-script.js")
admin_css_path = os.path.join(base_dir, "assets", "css", "admin-style.css")

# --- Update admin.html ---
with open(admin_html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Remove Upload Work Images button
html_content = re.sub(
    r'<button class="tab-btn" data-tab="upload-work">Upload Work Images</button>',
    '',
    html_content
)

# Remove Upload Work Images pane
upload_work_pattern = r'<!-- Upload Work Images -->.*?<!-- Upload Materials -->'
html_content = re.sub(upload_work_pattern, '<!-- Upload Materials -->', html_content, flags=re.DOTALL)

# Add existing materials container
# For Ceiling Tiles
html_content = html_content.replace(
    '<div id="ceilingTilesPreview" class="preview-grid"></div>',
    '<div id="ceilingTilesPreview" class="preview-grid"></div>\n                    <h4>Existing Ceiling Tiles</h4>\n                    <div id="existingCeilingTiles" class="existing-grid preview-grid"></div>'
)
# For Roof Tiles
html_content = html_content.replace(
    '<div id="roofTilesPreview" class="preview-grid"></div>',
    '<div id="roofTilesPreview" class="preview-grid"></div>\n                    <h4>Existing Roof Tiles</h4>\n                    <div id="existingRoofTiles" class="existing-grid preview-grid"></div>'
)
# For Fabrication
html_content = html_content.replace(
    '<div id="fabricationPreview" class="preview-grid"></div>',
    '<div id="fabricationPreview" class="preview-grid"></div>\n                    <h4>Existing Fabrication Materials</h4>\n                    <div id="existingFabrication" class="existing-grid preview-grid"></div>'
)

with open(admin_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

# --- Update admin-script.js ---
with open(admin_js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# Update loadProjectsList to add preview image
project_list_pattern = r'projectsList\.innerHTML = projectsArray\.map\(project => `(.*?)`\)\.join\(\'\'\);'
project_list_replacement = r'''projectsList.innerHTML = projectsArray.map(project => {
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
    `}).join('');'''

js_content = re.sub(
    r'projectsList\.innerHTML = projectsArray\.map\(project => `\s*<div class="project-card">.*?</div >\s*`\)\.join\(\'\'\);',
    project_list_replacement,
    js_content,
    flags=re.DOTALL
)

# For project-card pattern, since I used a different regex, I'll be exact
old_project_card = """projectsList.innerHTML = projectsArray.map(project => `
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
    `).join('');"""

js_content = js_content.replace(old_project_card, project_list_replacement)

# Add loadExistingMaterials logic and delete function
existing_materials_js = """
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
"""

js_content += "\n" + existing_materials_js

# Hook loadExistingMaterials to the upload materials tab click
tab_hook_old = """
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
"""
tab_hook_new = """
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        if (targetTab === 'upload-materials') {
            loadExistingMaterials();
        }
"""
js_content = js_content.replace(tab_hook_old, tab_hook_new)

# Initial call if dashboard is block or on load
init_hook_old = """
    // Load projects when the tab is active
    const manageProjectsTab = document.querySelector('[data-tab="manage-projects"]');
"""
init_hook_new = """
    // Load existing materials if tab is active
    const materialsTab = document.querySelector('[data-tab="upload-materials"]');
    if (materialsTab && materialsTab.classList.contains('active')) {
        loadExistingMaterials();
    }

    // Load projects when the tab is active
    const manageProjectsTab = document.querySelector('[data-tab="manage-projects"]');
"""
js_content = js_content.replace(init_hook_old, init_hook_new)

with open(admin_js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print("Update complete")
