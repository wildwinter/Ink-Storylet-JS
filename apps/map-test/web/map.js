var _mapContainer = null;
var _mapClickHandler = null;

export const MapSymbolManager = {

    init: function(containerName, clickHandler) {
        _mapContainer = document.querySelector(containerName);
        _mapClickHandler = clickHandler;
    },
    
    // 1. Centralized function to attach the click listener
    _attachClickListener: function(element) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = element.getAttribute('data-location-id');
            const title = element.getAttribute('data-tooltip-title');
            _mapClickHandler(id, title);
        });
    },

    // 2. Function to create the HTML string for a new symbol
    _createSymbolHTML: function(data) {
        if (!data.id || !data.title || !data.description || !data.left || !data.top) {
            console.error("Missing required data for new symbol.", data);
            return null;
        }

        // Construct the full HTML element string
        return `
            <div 
                class="map-hit-area" 
                id="map-${data.id}"
                style="left: ${data.left}; top: ${data.top}; display:none;"
                data-location-id="${data.id}"  
                data-tooltip-title="${data.title}"
                data-tooltip-description="${data.description}"
            >
                <div class="map-symbol-visual"></div>
                <div class="map-tooltip">
                    <div class="tooltip-title" data-title="${data.title}"></div>
                    <div class="tooltip-description" data-description="${data.description}"></div>
                </div>
            </div>
        `;
    },

    // 3. Public method to programmatically add a new symbol (with callback)
    addSymbol: function(data) {
        const html = this._createSymbolHTML(data);
        if (!html) return;

        // Use DOM manipulation to create the element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html.trim();
        const newArea = tempDiv.firstChild;
        
        // Append the element to the map container
        _mapContainer.appendChild(newArea);

        // **CRITICAL: Attach the click handler immediately**
        this._attachClickListener(newArea);
        
        //console.log(`Symbol '${data.title}' (ID: ${data.id}) added and callback set.`);
        return newArea;
    },
    
    // 5. Helper to get the symbol element by ID
    _getSymbolElement: function(id) {
        const element = document.getElementById(`map-${id}`);
        if (!element) {
            console.warn(`Symbol with ID '${id}' not found.`);
        }
        return element;
    },

    // 6. Public method to show a symbol
    showSymbol: function(id) {
        const element = this._getSymbolElement(id);
        if (element) {
            element.style.display = 'block'; 
        }
    },

    // 7. Public method to hide a symbol
    hideSymbol: function(id) {
        const element = this._getSymbolElement(id);
        if (element) {
            element.style.display = 'none';
        }
    },

    iterateSymbols: function(callback) {
        // Select all elements with the map-hit-area class inside the map container
        const allSymbols = _mapContainer.querySelectorAll('.map-hit-area');

        allSymbols.forEach(element => {
            const id = element.getAttribute('data-location-id');
            const title = element.getAttribute('data-tooltip-title');
            const isVisible = element.style.display !== 'none';
            
            // Execute the provided callback function
            // Pass the element itself, its ID, title, and visibility status
            callback(element, id, title, isVisible);
        });
    }
};