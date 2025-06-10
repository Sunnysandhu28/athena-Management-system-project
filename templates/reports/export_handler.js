/**
 * Export handler for dynamically generated reports
 */

// Initialize export buttons and functionality
function initializeExportHandlers() {
    // PDF Export handler
    document.getElementById('exportPdfBtn').addEventListener('click', async function() {
        // Get the preview content container
        const previewContent = document.getElementById('previewContent');
        
        // Get report title from the preview
        const reportTitle = document.getElementById('previewTitle').textContent || 'Compliance Report';
        
        try {
            // Use the PDF exporter to generate and download the PDF
            await reportExporter.exportAsPdf(reportTitle, previewContent);
        } catch (error) {
            console.error('PDF export error:', error);
            alert('There was an error exporting the PDF. Please try again.');
        }
    });
    
    // Word Export handler
    document.getElementById('exportWordBtn').addEventListener('click', async function() {
        // Get report title from the preview
        const reportTitle = document.getElementById('previewTitle').textContent || 'Compliance Report';
        
        try {
            // Use the Word exporter to generate and download the Word document
            await reportExporter.exportAsWord(reportTitle);
        } catch (error) {
            console.error('Word export error:', error);
            alert('There was an error exporting the Word document. Please try again.');
        }
    });
    
    // Add export dropdown functionality
    const exportDropdown = document.getElementById('exportDropdown');
    if (exportDropdown) {
        exportDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const exportMenu = document.getElementById('exportMenu');
            if (exportMenu) {
                exportMenu.classList.toggle('show');
            }
        });
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeExportHandlers();
});