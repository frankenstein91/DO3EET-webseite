document.addEventListener('DOMContentLoaded', () => {
    const cliNavigator = document.getElementById('cli-navigator');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');
    const cliScrollArea = document.getElementById('cli-scroll-area');
    const prompts = document.querySelectorAll('.cli-input-wrapper .prompt-dir');

    if (!cliNavigator || !cliInput || !cliOutput || !cliScrollArea) return;

    let vfs = { '/': { type: 'dir', children: {} } };
    let currentPath = '/';
    let pagesData = [];

    // History Logic
    let history = JSON.parse(sessionStorage.getItem('cli_history') || '[]');
    let historyIndex = -1;
    let tempInput = '';

    const saveHistory = (cmd) => {
        if (cmd && history[history.length - 1] !== cmd) {
            history.push(cmd);
            if (history.length > 50) history.shift();
            sessionStorage.setItem('cli_history', JSON.stringify(history));
        }
        historyIndex = -1;
    };

    const clearHistory = () => {
        history = [];
        sessionStorage.removeItem('cli_history');
        historyIndex = -1;
    };

    // JSON laden und VFS aufbauen
    fetch('/cli-index.json')
        .then(response => response.json())
        .then(data => {
            pagesData = data;
            buildVFS(data);
        })
        .catch(err => console.error('Failed to load CLI index:', err));

    function buildVFS(data) {
        data.forEach(page => {
            const parts = (page.path || "").split('/').filter(p => p);
            let current = vfs['/'];
            
            parts.forEach((part, index) => {
                const isLast = index === parts.length - 1;
                if (isLast && page.kind === 'page') {
                    current.children[part] = { type: 'file', data: page };
                } else {
                    if (!current.children[part]) {
                        current.children[part] = { type: 'dir', children: {} };
                    }
                    current = current.children[part];
                    if (isLast) current.data = page;
                }
            });
        });

        if (!vfs['/'].children['tags']) {
            vfs['/'].children['tags'] = { type: 'dir', children: {} };
        }
        
        data.forEach(page => {
            if (page.kind === 'page' && page.tags) {
                page.tags.forEach(tag => {
                    const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
                    if (!vfs['/'].children['tags'].children[tagSlug]) {
                        vfs['/'].children['tags'].children[tagSlug] = { type: 'dir', children: {} };
                    }
                    const fileName = (page.path || "").split('/').pop() || page.title;
                    vfs['/'].children['tags'].children[tagSlug].children[fileName] = { type: 'file', data: page };
                });
            }
        });
    }

    const scrollToBottom = () => {
        cliScrollArea.scrollTop = cliScrollArea.scrollHeight;
    };

    const updatePrompt = () => {
        const displayPath = currentPath === '/' ? '~' : currentPath.replace(/^\//, '~/');
        prompts.forEach(p => p.textContent = displayPath);
    };

    const toggleCLI = () => {
        const isVisible = cliNavigator.classList.toggle('is-visible');
        cliNavigator.setAttribute('aria-hidden', !isVisible);
        if (isVisible) {
            setTimeout(() => {
                cliInput.focus();
                scrollToBottom();
            }, 50);
        } else {
            cliInput.blur();
        }
    };

    cliNavigator.addEventListener('click', () => cliInput.focus());

    window.addEventListener('keydown', (e) => {
        if (e.key === '^' || e.key === 'Circumflex' || e.code === 'Backquote') {
            const activeElement = document.activeElement;
            const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
            if (!isInput) {
                e.preventDefault();
                toggleCLI();
            }
        }
        if (e.key === 'Escape' && cliNavigator.classList.contains('is-visible')) {
            toggleCLI();
        }
    });

    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = cliInput.value.trim();
            if (command) {
                saveHistory(command);
                processCommand(command);
            }
            cliInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                if (historyIndex === -1) {
                    tempInput = cliInput.value;
                    historyIndex = history.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                cliInput.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    cliInput.value = history[historyIndex];
                } else {
                    historyIndex = -1;
                    cliInput.value = tempInput;
                }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion();
        }
    });

    function handleTabCompletion() {
        const input = cliInput.value;
        const args = input.split(/\s+/);
        const currentWord = args[args.length - 1];
        const isCommand = args.length === 1;

        const commands = ['help', 'clear', 'exit', 'w', 'who', 'ls', 'cd', 'cat', 'open', 'history'];

        if (isCommand) {
            const matches = commands.filter(c => c.startsWith(currentWord.toLowerCase()));
            if (matches.length === 1) {
                cliInput.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                showCompletions(matches);
            }
        } else {
            const dir = getDir(currentPath);
            if (!dir) return;
            const items = Object.keys(dir.children);
            const matches = items.filter(item => item.startsWith(currentWord));
            
            if (matches.length === 1) {
                const item = dir.children[matches[0]];
                cliInput.value = input.substring(0, input.lastIndexOf(currentWord)) + matches[0] + (item.type === 'dir' ? '/' : ' ');
            } else if (matches.length > 1) {
                showCompletions(matches);
            }
        }
    }

    function showCompletions(matches) {
        const line = document.createElement('div');
        line.className = 'cli-line';
        line.style.color = 'var(--off-fg)';
        line.textContent = matches.join('  ');
        cliOutput.appendChild(line);
        scrollToBottom();
    }

    function getDir(path) {
        if (path === '/') return vfs['/'];
        const parts = path.split('/').filter(p => p);
        let current = vfs['/'];
        for (const part of parts) {
            if (current.children && current.children[part] && current.children[part].type === 'dir') {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    function processCommand(input) {
        const line = document.createElement('div');
        line.className = 'cli-line';
        const displayPath = currentPath === '/' ? '~' : currentPath.replace(/^\//, '~/');
        line.innerHTML = `<span class="terminal-prompt"><span class="prompt-user">Guest@do3eet.pages.dev</span>:<span class="prompt-dir">${displayPath}</span>$</span> ${input}`;
        cliOutput.appendChild(line);

        const args = input.trim().split(/\s+/);
        const cmd = args[0].toLowerCase();
        const response = document.createElement('div');
        response.className = 'cli-line';
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        switch (cmd) {
            case 'help':
                response.textContent = 'Available commands: help, clear, exit, w, who, ls, cd, cat, open, history';
                break;
            case 'w':
                response.style.whiteSpace = 'pre';
                response.textContent = ` ${timeStr} up 14 days, 3 users, load average: 0.08, 0.04, 0.05\n` +
                                     `USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\n` +
                                     `admin    tty1     -                08:00    4:32m  0.12s  0.12s -bash\n` +
                                     `DO3EET   pts/0    10.0.0.1         09:15    1:20s  0.55s  0.02s hugo server\n` +
                                     `Guest    pts/1    ${navigator.platform}    ${timeStr}    0.00s  0.01s  0.01s cli-navigator`;
                break;
            case 'who':
                const dateStr = now.toISOString().split('T')[0];
                response.style.whiteSpace = 'pre';
                response.textContent = `admin    tty1         ${dateStr} 08:00\n` +
                                     `DO3EET   pts/0        ${dateStr} 09:15 (10.0.0.1)\n` +
                                     `Guest    pts/1        ${dateStr} ${timeStr} (${navigator.userAgent.split(' ')[0]})`;
                break;
            case 'ls':
                const dir = getDir(currentPath);
                if (dir) {
                    const items = Object.keys(dir.children).sort().map(name => {
                        const item = dir.children[name];
                        return item.type === 'dir' ? `<span style="color: #7aa2f7; font-weight: bold;">${name}/</span>` : name;
                    });
                    response.innerHTML = items.join('  ');
                }
                break;
            case 'cd':
                const target = args[1];
                if (!target || target === '~' || target === '/') {
                    currentPath = '/';
                } else if (target === '..') {
                    if (currentPath !== '/') {
                        const parts = currentPath.split('/').filter(p => p);
                        parts.pop();
                        currentPath = '/' + (parts.join('/') || "");
                        if (currentPath === '') currentPath = '/';
                    }
                } else {
                    const newPath = currentPath === '/' ? `/${target}` : `${currentPath}/${target}`;
                    if (getDir(newPath)) {
                        currentPath = newPath;
                    } else {
                        response.textContent = `cd: no such directory: ${target}`;
                    }
                }
                updatePrompt();
                break;
            case 'cat':
                const fileName = args[1] || ".";
                const currentDirForCat = getDir(currentPath);
                let itemForCat;
                
                if (fileName === ".") {
                    itemForCat = currentDirForCat;
                } else {
                    itemForCat = currentDirForCat.children[fileName];
                }

                if (itemForCat && itemForCat.data) {
                    response.style.whiteSpace = 'pre-wrap';
                    response.textContent = `Title: ${itemForCat.data.title}\n---\n${itemForCat.data.summary}`;
                } else if (itemForCat && itemForCat.type === 'dir') {
                    response.textContent = `cat: ${fileName}: Is a directory (no additional content)`;
                } else {
                    response.textContent = `cat: ${fileName}: No such file`;
                }
                break;
            case 'open':
                const fileToOpen = args[1] || ".";
                const currentDirForOpen = getDir(currentPath);
                let itemToOpen;

                if (fileToOpen === ".") {
                    itemToOpen = currentDirForOpen;
                } else {
                    itemToOpen = currentDirForOpen.children[fileToOpen];
                }

                if (itemToOpen && itemToOpen.data) {
                    window.location.href = itemToOpen.data.url;
                    return;
                } else {
                    response.textContent = `open: ${fileToOpen}: No such file or data`;
                }
                break;
            case 'history':
                if (args[1] === '-c') {
                    clearHistory();
                    response.textContent = 'History cleared.';
                } else {
                    response.style.whiteSpace = 'pre';
                    response.textContent = history.map((c, i) => `${i + 1}  ${c}`).join('\n');
                }
                break;
            case 'clear':
                cliOutput.innerHTML = '';
                return;
            case 'exit':
                toggleCLI();
                return;
            default:
                response.textContent = `Command not found: ${cmd}`;
        }

        cliOutput.appendChild(response);
        scrollToBottom();
    }
});
