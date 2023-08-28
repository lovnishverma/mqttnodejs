$(document).ready(function () {
  // Connect to the WebSocket server
  const socket = io();

  // Get a reference to the audio element
  const clickSound = document.getElementById('clickSound');

  // Load the audio
  clickSound.load();

  // Listen for status updates
  socket.on('statusUpdate', function (status) {
    updateAppStatus(status); // Call the function to update status and toggle switch
      // Play the click sound
    clickSound.play();
  });

  // Function to update app status and toggle switch
  function updateAppStatus(appStatus) {
    $('#appStatus').text('App Status: ' + appStatus);
    $('#toggleSwitch').prop('checked', appStatus === 'on');

    // Update body background color based on the switch status
    if (appStatus === 'on') {
      document.body.style.backgroundColor = 'yellow'; // Change to desired color
    } else {
      document.body.style.backgroundColor = 'grey'; // Change to desired color
    }
  }

  $('#toggleSwitch').change(function () {
    const isChecked = $(this).is(':checked');
    const command = isChecked ? '1' : '0';

    // Emit the toggleSwitch event to the server
    socket.emit('toggleSwitch', isChecked);

    $.post('/send-command', { command }, function (data) {
      console.log(data);

      // After sending command, update app status and toggle switch
      $.get('/app-status', function (data) {
        updateAppStatus(data.status);
      });
    });
  });

  // Initial update
  $.get('/app-status', function (data) {
    updateAppStatus(data.status);
  });
});
