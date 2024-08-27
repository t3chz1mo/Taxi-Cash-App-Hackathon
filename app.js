let web3;
let kit;
document.addEventListener('DOMContentLoaded', () => {
  const connectWalletButton = document.getElementById('connectWalletButton');
  const sendButton = document.getElementById('sendButton');

  connectWalletButton.addEventListener('click', connectCeloWallet);
  sendButton.addEventListener('click', sendPayment);
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

document.getElementById('connectWallet').addEventListener('click', connectCeloWallet);
document.getElementById('sendTransaction').addEventListener('click', sendTransaction);