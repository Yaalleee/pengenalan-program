// Variables (a)
        let selectedGame = '';
        let selectedDiamond = null;
        let transactionId = '';
        const games = {
            freefire: {
                name: 'Free Fire',
                currency: 'Diamond',
                servers: ['Indonesia', 'Singapore', 'Thailand', 'Malaysia'],
                packages: [
                    { amount: '70 Diamond', price: 10000 },
                    { amount: '140 Diamond', price: 20000 },
                    { amount: '355 Diamond', price: 50000 },
                    { amount: '720 Diamond', price: 100000 },
                    { amount: '1450 Diamond', price: 200000 },
                    { amount: '2180 Diamond', price: 300000 }
                ]
            },
            mobilelegends: {
                name: 'Mobile Legends',
                currency: 'Diamond',
                servers: ['Indonesia', 'Malaysia', 'Singapore', 'Philippines'],
                packages: [
                    { amount: '86 Diamond', price: 15000 },
                    { amount: '172 Diamond', price: 30000 },
                    { amount: '429 Diamond', price: 75000 },
                    { amount: '878 Diamond', price: 150000 },
                    { amount: '1412 Diamond', price: 250000 },
                    { amount: '2195 Diamond', price: 375000 }
                ]
            },
            genshin: {
                name: 'Genshin Impact',
                currency: 'Genesis Crystal',
                servers: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
                packages: [
                    { amount: '60 Genesis Crystal', price: 15000 },
                    { amount: '300 Genesis Crystal', price: 75000 },
                    { amount: '980 Genesis Crystal', price: 250000 },
                    { amount: '1980 Genesis Crystal', price: 500000 },
                    { amount: '3280 Genesis Crystal', price: 750000 },
                    { amount: '6480 Genesis Crystal', price: 1500000 }
                ]
            },
            codm: {
                name: 'Call of Duty Mobile',
                currency: 'COD Points',
                servers: ['Global', 'Garena Indonesia', 'Garena Malaysia', 'Garena Philippines'],
                packages: [
                    { amount: '80 COD Points', price: 15000 },
                    { amount: '400 COD Points', price: 75000 },
                    { amount: '800 COD Points', price: 150000 },
                    { amount: '2000 COD Points', price: 375000 },
                    { amount: '5600 COD Points', price: 1000000 },
                    { amount: '9600 COD Points', price: 1750000 }
                ]
            }
        };

        // Functions (d)
        function selectGame(gameKey) {
            selectedGame = gameKey;
            
            // Update UI - remove previous selection
            document.querySelectorAll('.game-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Add selection to current game
            document.querySelector(`[data-game="${gameKey}"]`).classList.add('selected');
            
            // Show form section
            const formSection = document.getElementById('formSection');
            formSection.classList.add('active');
            
            // Update form content
            updateFormContent(gameKey);
        }

        function updateFormContent(gameKey) {
            const game = games[gameKey];
            document.getElementById('gameTitle').textContent = `Top Up ${game.name}`;
            
            // Update server options using loop (c)
            const serverSelect = document.getElementById('serverSelect');
            serverSelect.innerHTML = '<option value="">Pilih Server</option>';
            for (let i = 0; i < game.servers.length; i++) {
                const option = document.createElement('option');
                option.value = game.servers[i];
                option.textContent = game.servers[i];
                serverSelect.appendChild(option);
            }
            
            // Update diamond packages using map (c)
            const diamondGrid = document.getElementById('diamondGrid');
            diamondGrid.innerHTML = '';
            game.packages.map((pkg, index) => {
                const diamondOption = document.createElement('div');
                diamondOption.className = 'diamond-option';
                diamondOption.dataset.index = index;
                diamondOption.innerHTML = `
                    <div class="diamond-amount">${pkg.amount}</div>
                    <div class="diamond-price">Rp ${formatPrice(pkg.price)}</div>
                `;
                diamondOption.onclick = () => selectDiamond(index);
                diamondGrid.appendChild(diamondOption);
            });
        }

        function selectDiamond(index) {
            selectedDiamond = index;
            
            // Update UI
            document.querySelectorAll('.diamond-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector(`[data-index="${index}"]`).classList.add('selected');
            
            updateSummary();
        }

        function updateSummary() {
            // Condition check (b)
            if (!selectedGame || selectedDiamond === null) {
                return;
            }
            
            const game = games[selectedGame];
            const userId = document.getElementById('userId').value;
            const server = document.getElementById('serverSelect').value;
            const payment = document.getElementById('paymentMethod').value;
            const pkg = game.packages[selectedDiamond];
            
            // Show summary if all required fields are present (b)
            if (userId && server && payment) {
                document.getElementById('summary').style.display = 'block';
                document.getElementById('summaryGame').textContent = game.name;
                document.getElementById('summaryUserId').textContent = userId;
                document.getElementById('summaryServer').textContent = server;
                document.getElementById('summaryPackage').textContent = pkg.amount;
                document.getElementById('summaryPayment').textContent = payment.toUpperCase();
                document.getElementById('summaryTotal').textContent = `Rp ${formatPrice(pkg.price)}`;
            } else {
                document.getElementById('summary').style.display = 'none';
            }
        }

        function formatPrice(price) {
            return price.toLocaleString('id-ID');
        }

        function generateTransactionId() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            return `TXN${timestamp}${random}`;
        }

        function validateForm() {
            let isValid = true;
            
            // Reset errors
            document.querySelectorAll('.error').forEach(error => {
                error.style.display = 'none';
            });
            
            const userId = document.getElementById('userId').value.trim();
            const server = document.getElementById('serverSelect').value;
            const payment = document.getElementById('paymentMethod').value;
            
            // Validation conditions (b)
            if (!userId) {
                document.getElementById('userIdError').style.display = 'block';
                isValid = false;
            }
            
            if (!server) {
                document.getElementById('serverError').style.display = 'block';
                isValid = false;
            }
            
            if (!selectedGame) {
                alert('Pilih game terlebih dahulu!');
                isValid = false;
            }
            
            if (selectedDiamond === null) {
                document.getElementById('diamondError').style.display = 'block';
                isValid = false;
            }
            
            if (!payment) {
                document.getElementById('paymentError').style.display = 'block';
                isValid = false;
            }
            
            return isValid;
        }

        async function processTransaction() {
            // Input validation (e)
            if (!validateForm()) {
                return;
            }
            
            // Show loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('processBtn').disabled = true;
            
            // Generate transaction ID
            transactionId = generateTransactionId();
            
            // Simulate processing time with promise
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Hide loading
            document.getElementById('loading').style.display = 'none';
            document.getElementById('processBtn').disabled = false;
            
            // Show success modal (output) (e)
            showSuccessModal();
        }

        function showSuccessModal() {
            const game = games[selectedGame];
            const pkg = game.packages[selectedDiamond];
            const userId = document.getElementById('userId').value;
            const server = document.getElementById('serverSelect').value;
            const payment = document.getElementById('paymentMethod').value;
            
            const successMessage = `${pkg.amount} berhasil ditambahkan ke akun ${game.name} Anda!`;
            document.getElementById('successMessage').textContent = successMessage;
            
            // Transaction details
            const details = `
                <strong>📋 Detail Transaksi:</strong><br>
                <strong>ID Transaksi:</strong> ${transactionId}<br>
                <strong>Game:</strong> ${game.name}<br>
                <strong>User ID:</strong> ${userId}<br>
                <strong>Server:</strong> ${server}<br>
                <strong>Paket:</strong> ${pkg.amount}<br>
                <strong>Total:</strong> Rp ${formatPrice(pkg.price)}<br>
                <strong>Pembayaran:</strong> ${payment.toUpperCase()}<br>
                <strong>Status:</strong> <span style="color: #4CAF50;">✓ Berhasil</span><br>
                <strong>Waktu:</strong> ${new Date().toLocaleString('id-ID')}
            `;
            document.getElementById('transactionDetails').innerHTML = details;
            
            document.getElementById('successModal').style.display = 'flex';
        }

        function closeSuccessModal() {
            document.getElementById('successModal').style.display = 'none';
            resetForm();
        }

        function resetForm() {
            // Reset all variables and form
            selectedGame = '';
            selectedDiamond = null;
            transactionId = '';
            
            document.querySelectorAll('.game-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            document.getElementById('formSection').classList.remove('active');
            document.getElementById('userId').value = '';
            document.getElementById('serverSelect').value = '';
            document.getElementById('paymentMethod').value = '';
            document.getElementById('summary').style.display = 'none';
            
            document.querySelectorAll('.error').forEach(error => {
                error.style.display = 'none';
            });
        }

        // Event listeners for real-time validation and summary update
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listeners for game cards
            document.querySelectorAll('.game-card').forEach(card => {
                card.addEventListener('click', function() {
                    selectGame(this.dataset.game);
                });
            });
            
            // Add event listeners for form fields
            ['userId', 'serverSelect', 'paymentMethod'].forEach(id => {
                document.getElementById(id).addEventListener('change', updateSummary);
                document.getElementById(id).addEventListener('input', updateSummary);
            });
        });

        // Switch case example for payment method processing (b)
        function getPaymentIcon(method) {
            switch(method) {
                case 'dana':
                    return '💳 DANA';
                case 'ovo':
                    return '🟠 OVO';
                case 'gopay':
                    return '🟢 GoPay';
                case 'shopeepay':
                    return '🧡 ShopeePay';
                case 'bank':
                    return '🏦 Transfer Bank';
                default:
                    return '💳 Payment';
            }
        }

        // While loop example for generating secure transaction ID (c)
        function generateSecureId() {
            let id = '';
            let length = 0;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            
            while (length < 8) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
                length++;
            }
            
            return `GAME${id}`;
        }