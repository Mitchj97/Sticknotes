document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addNote').addEventListener('click', addNewNote);
    document.getElementById('clearAll').addEventListener('click', () => {
        document.getElementById('board').innerHTML = ''; // Clear all notes
    });

    function addNewNote() {
        const board = document.getElementById('board');
        const note = document.createElement('div');
        note.classList.add('note');
        note.style.left = "20px";
        note.style.top = "20px";
        note.innerText = "Type your note here...";
        board.appendChild(note);
        noteActions(note);
    }

    function noteActions(note) {
        let isDragging = false;
        let dragStartX, dragStartY;

        note.addEventListener('mousedown', function(event) {
            if (event.button !== 0) return; // Only allow left click for dragging
            isDragging = true;
            dragStartX = event.clientX - note.offsetLeft;
            dragStartY = event.clientY - note.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, { once: true });
        });

        function onMouseMove(event) {
            if (isDragging) {
                note.style.left = (event.clientX - dragStartX) + 'px';
                note.style.top = (event.clientY - dragStartY) + 'px';
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
        }

        note.addEventListener('dblclick', function() {
            note.contentEditable = "true";
            note.focus(); // focus on the note to start editing
        });

        note.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(note, event.pageX, event.pageY);
        });

        function showContextMenu(note, x, y) {
            // Clear existing menu
            let existingMenu = document.querySelector('.menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            let menu = document.createElement('div');
            menu.className = 'menu';
            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
            menu.style.display = 'block'; // Ensure menu is visible
            document.body.appendChild(menu);

            // Add menu items
            addMenuItem(menu, 'Set Color', () => promptColor(note));
            addMenuItem(menu, 'Tag: Urgent', () => note.style.border = '3px solid red');
            addMenuItem(menu, 'Tag: Important', () => note.style.border = '3px solid orange');
            addMenuItem(menu, 'Tag: Less Important', () => note.style.border = '3px solid yellow');
            addMenuItem(menu, 'Delete Note', () => note.remove());

            // Close menu on click outside
            document.addEventListener('click', function onClickOutside(event) {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener('click', onClickOutside);
                }
            });
        }

        function addMenuItem(menu, text, action) {
            let item = document.createElement('button');
            item.textContent = text;
            item.onclick = action;
            menu.appendChild(item);
        }

        function promptColor(note) {
            let color = prompt("Enter a hex color (e.g., #ff0000):");
            if (color) note.style.backgroundColor = color;
        }
    }
});

