import mongoose from 'mongoose'

export default defineEventHandler(async (event) => {
  try {
    // The connection is now managed by the server plugin.
    // We just check the state.
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB not connected. Current state: ' + mongoose.connection.readyState);
    }

    const connection = mongoose.connection;
    const adminDb = connection.db.admin();
    const serverInfo = await adminDb.serverInfo();
    
    // We don't disconnect here anymore.

    return {
      success: true,
      message: 'MongoDB is connected',
      readyState: mongoose.connection.readyState,
      serverInfo: {
        version: serverInfo.version,
        host: serverInfo.host,
        process: serverInfo.process
      },
      connectionString: (mongoose.connection as any).client.s.url // Get the URL from the existing connection
    }
  } catch (error: any) {
    return {
      success: false,
      message: 'MongoDB connection check failed',
      readyState: mongoose.connection.readyState,
      error: error.message,
    }
  }
})
