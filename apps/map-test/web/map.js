var _mapContainer = null;
var _mapClickHandler = null;

export const MapSymbolManager = {

    init: function(containerName, clickHandler) {
        _mapContainer = document.querySelector(containerName);
        _mapClickHandler = clickHandler;
    },
    
    _attachClickListener: function(element) {
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = element.getAttribute('data-location-id');
            const title = element.getAttribute('data-tooltip-title');
            _mapClickHandler(id, title);
        });
    },

    _createSymbolHTML: function(data) {
        if (!data.id || !data.title || !data.description || !data.left || !data.top) {
            console.error("Missing required data for new symbol.", data);
            return null;
        }

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

    addSymbol: function(data) {
        const html = this._createSymbolHTML(data);
        if (!html) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html.trim();
        const newArea = tempDiv.firstChild;
        
        _mapContainer.appendChild(newArea);

        this._attachClickListener(newArea);
        
        return newArea;
    },
    
    _getSymbolElement: function(id) {
        const element = document.getElementById(`map-${id}`);
        if (!element) {
            console.warn(`Symbol with ID '${id}' not found.`);
        }
        return element;
    },

    showSymbol: function(id) {
        const element = this._getSymbolElement(id);
        if (element) {
            element.style.display = 'block'; 
        }
    },

    hideSymbol: function(id) {
        const element = this._getSymbolElement(id);
        if (element) {
            element.style.display = 'none';
        }
    },

    setSymbolDesc: function(id, desc) {
        const element = this._getSymbolElement(id);
        if (element) {
            const descriptionElement = element.querySelector('.tooltip-description');
            element.setAttribute('data-tooltip-description', desc);
            if (descriptionElement) {
                descriptionElement.setAttribute('data-description', desc);
            }
        }
    },

    iterateSymbols: function(callback) {

        const allSymbols = _mapContainer.querySelectorAll('.map-hit-area');

        allSymbols.forEach(element => {
            const id = element.getAttribute('data-location-id');
            const title = element.getAttribute('data-tooltip-title');
            const isVisible = element.style.display !== 'none';
            
            callback(element, id, title, isVisible);
        });
    },

    // Stop the map being clickable
    lockMap:function() {
        _mapContainer.classList.add('locked');
    },

    // Allow the map to be clickable again.
    unlockMap:function() {
        _mapContainer.classList.remove('locked');
    }
};