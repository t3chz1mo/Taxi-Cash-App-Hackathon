let web3;
let kit;
let html5QrCode;

document.addEventListener('DOMContentLoaded', () => {
  const connectWalletButton = document.getElementById('connectWalletButton');
  const disconnectButton = document.getElementById('disconnectButton');
  const sendButton = document.getElementById('sendButton');
  const taxiButton = document.getElementById('taxiButton');
  const passengerButton = document.getElementById('passengerButton');
  const scanQRButton = document.getElementById('scanQRButton');

  connectWalletButton.addEventListener('click', connectCeloWallet);
  disconnectButton.addEventListener('click', disconnectWallet);
  sendButton.addEventListener('click', sendPayment);
  taxiButton.addEventListener('click', showTaxiQRCode);
  passengerButton.addEventListener('click', showPassengerInfo);
  scanQRButton.addEventListener('click', startQRScanner);
});

async function connectCeloWallet() {
  if (window.celo) {
    try {
      await window.celo.enable();
      web3 = new Web3(window.celo);

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      document.getElementById('status').innerText = `Connected`;
      document.getElementById('account').innerText = account;
      document.getElementById('accountInfo').style.display = 'block';
      document.getElementById('connectWalletButton').style.display = 'none';
      document.getElementById('disconnectButton').style.display = 'inline-block';
      document.getElementById('roleSelection').style.display = 'block';

      const balance = await web3.eth.getBalance(account);
      document.getElementById('balance').innerText = web3.utils.fromWei(balance, 'ether');

    } catch (error) {
      console.error('Error connecting to Celo wallet:', error);
      document.getElementById('status').innerText = 'Error connecting to wallet';
    }
  } else {
    alert('Please install a Celo compatible wallet extension like Valora or CeloExtensionWallet.');
  }
}

function disconnectWallet() {
  web3 = null;
  document.getElementById('status').innerText = 'Not connected';
  document.getElementById('account').innerText = '';
  document.getElementById('balance').innerText = '';
  document.getElementById('accountInfo').style.display = 'none';
  document.getElementById('roleSelection').style.display = 'none';
  document.getElementById('taxiInfo').style.display = 'none';
  document.getElementById('passengerInfo').style.display = 'none';
  document.getElementById('connectWalletButton').style.display = 'inline-block';
  document.getElementById('disconnectButton').style.display = 'none';
}

function showTaxiQRCode() {
  const account = document.getElementById('account').innerText;
  const qr = qrcode(0, 'M');
  qr.addData(account);
  qr.make();
  document.getElementById('qrcode').innerHTML = qr.createImgTag(5);
  document.getElementById('taxiInfo').style.display = 'block';
  document.getElementById('passengerInfo').style.display = 'none';
}

function showPassengerInfo() {
  document.getElementById('passengerInfo').style.display = 'block';
  document.getElementById('taxiInfo').style.display = 'none';
}

function startQRScanner() {
  const qrReader = document.getElementById('qrReader');
  qrReader.style.display = 'block';
  
  html5QrCode = new Html5Qrcode("qrReader");
  html5QrCode.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    },
    onScanSuccess,
    onScanFailure
  );
}

function onScanSuccess(decodedText, decodedResult) {
  html5QrCode.stop();
  document.getElementById('qrReader').style.display = 'none';
  document.getElementById('recipient').value = decodedText;
}

function onScanFailure(error) {
  console.warn(`QR code scanning failed: ${error}`);
}

async function sendPayment() {
  const recipient = document.getElementById('recipient').value;
  const amount = document.getElementById('amount').value;
  const account = document.getElementById('account').innerText;

  if (web3 && account) {
    try {
      await web3.eth.sendTransaction({
        from: account,
        to: recipient,
        value: web3.utils.toWei(amount, 'ether'),
      });
      alert('Payment sent successfully!');
    } catch (error) {
      console.error('Error sending payment:', error);
      alert('Error sending payment.');
    }
  } else {
    alert('Wallet not connected.');
  }
}

function onScanSuccess(decodedText, decodedResult) {
  html5QrCode.stop();
  document.getElementById('qrReader').style.display = 'none';
  document.getElementById('recipient').value = decodedText;
  showRouteOptions();
}

function showRouteOptions() {
  const routes = [
    { from: 'Wynberg', to: 'Claremont', price: 0.05 },
    { from: 'Wynberg', to: 'Rondebosch', price: 0.075 },
    { from: 'Wynberg', to: 'Observatory', price: 0.08 },
    { from: 'Wynberg', to: 'Cape Town', price: 0.1 }
  ];

  const routeOptionsHtml = routes.map(route => `
    <button class="route-option" data-price="${route.price}">
      ${route.from} to ${route.to} (${route.price} CELO)
    </button>
  `).join('');

  const routeOptionsDiv = document.createElement('div');
  routeOptionsDiv.id = 'routeOptions';
  routeOptionsDiv.innerHTML = `
    <h3>Select your route:</h3>
    ${routeOptionsHtml}
    <button id="customAmountButton">Enter custom amount</button>
  `;

  const passengerInfo = document.getElementById('passengerInfo');
  passengerInfo.insertBefore(routeOptionsDiv, passengerInfo.firstChild);

  document.querySelectorAll('.route-option').forEach(button => {
    button.addEventListener('click', function() {
      document.getElementById('amount').value = this.dataset.price;
    });
  });

  document.getElementById('customAmountButton').addEventListener('click', function() {
    document.getElementById('amount').value = '';
    document.getElementById('amount').focus();
  });
}

document.getElementById('connectWallet').addEventListener('click', connectCeloWallet);
document.getElementById('sendTransaction').addEventListener('click', sendTransaction);