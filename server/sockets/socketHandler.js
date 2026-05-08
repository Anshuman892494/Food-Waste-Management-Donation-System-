const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join room based on user role or ID
    socket.on('joinRoom', ({ userId, role }) => {
      if (userId) {
        socket.join(userId); // Personal room for notifications
        console.log(`User ${userId} joined their personal room`);
      }
      if (role) {
        socket.join(role); // Role-based room (e.g., 'ngo', 'volunteer')
        console.log(`User joined role room: ${role}`);
      }
    });

    // Custom events can be added here
    socket.on('donationAccepted', (data) => {
      // Broadcast to donor that their food was accepted
      io.to(data.donorId).emit('notification', {
        type: 'accepted',
        message: `Your donation for ${data.foodName} was accepted!`,
        donationId: data.donationId
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
