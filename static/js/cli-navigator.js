document.addEventListener('DOMContentLoaded', () => {
    const cliNavigator = document.getElementById('cli-navigator');
    const cliInput = document.getElementById('cli-input');
    const cliOutput = document.getElementById('cli-output');

    const cliScrollArea = document.getElementById('cli-scroll-area');

    if (!cliNavigator || !cliInput || !cliOutput || !cliScrollArea) return;

    const scrollToBottom = () => {
        cliScrollArea.scrollTop = cliScrollArea.scrollHeight;
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

    // Klick anywhere in the CLI to focus input
    cliNavigator.addEventListener('click', () => {
        cliInput.focus();
    });

    window.addEventListener('keydown', (e) => {
        // Prüfen ob die Taste '^' gedrückt wurde
        // Firefox/Dead-Key Handling: e.key kann '^', 'Dead' oder 'Circumflex' sein.
        // e.code 'Backquote' ist die physikalische Taste links neben der '1' auf QWERTZ.
        if (e.key === '^' || e.key === 'Circumflex' || e.code === 'Backquote') {
            // Ignorieren wenn der User in einem Input-Feld ist
            const activeElement = document.activeElement;
            const isInput = activeElement.tagName === 'INPUT' || 
                          activeElement.tagName === 'TEXTAREA' || 
                          activeElement.isContentEditable;

            if (!isInput) {
                e.preventDefault();
                toggleCLI();
            }
        }

        // Mit Escape schließen
        if (e.key === 'Escape' && cliNavigator.classList.contains('is-visible')) {
            toggleCLI();
        }
    });

    // Basis-Eingabe-Logik
    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = cliInput.value.trim();
            if (command) {
                processCommand(command);
            }
            cliInput.value = '';
        }
    });

    function processCommand(cmd) {
        // Echo des Befehls
        const line = document.createElement('div');
        line.className = 'cli-line';
        line.innerHTML = `<span class="terminal-prompt"><span class="prompt-user">Guest@do3eet.pages.dev</span>:<span class="prompt-dir">~</span>$</span> ${cmd}`;
        cliOutput.appendChild(line);

        // Befehl verarbeiten (vorerst nur Platzhalter)
        const response = document.createElement('div');
        response.className = 'cli-line';
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toISOString().split('T')[0];

        switch (cmd.toLowerCase()) {
            case 'help':
                response.textContent = 'Available commands: help, clear, exit, w, who';
                break;
            case 'w':
                const uptime = "14 days, 4:32";
                const load = "0.08, 0.04, 0.05";
                let wOutput = ` ${timeStr} up ${uptime}, 3 users, load average: ${load}\n`;
                wOutput += `USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\n`;
                wOutput += `admin    tty1     -                08:00    4:32m  0.12s  0.12s -bash\n`;
                wOutput += `DO3EET   pts/0    10.0.0.1         09:15    1:20s  0.55s  0.02s hugo server\n`;
                wOutput += `Guest    pts/1    ${navigator.platform}    ${timeStr}    0.00s  0.01s  0.01s cli-navigator`;
                
                response.style.whiteSpace = 'pre';
                response.textContent = wOutput;
                break;
            case 'who':
                let whoOutput = `admin    tty1         ${dateStr} 08:00\n`;
                whoOutput += `DO3EET   pts/0        ${dateStr} 09:15 (10.0.0.1)\n`;
                whoOutput += `Guest    pts/1        ${dateStr} ${timeStr} (${navigator.userAgent.split(' ')[0]})`;
                
                response.style.whiteSpace = 'pre';
                response.textContent = whoOutput;
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
        
        // Zum Ende scrollen
        cliScrollArea.scrollTop = cliScrollArea.scrollHeight;
    }
});
