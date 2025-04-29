import ImageKit from 'imagekit';

var imagekit = new ImageKit({
    publicKey : 'public_NKi8+yEnGsfM9yGKqKjl+aeIMkw=',
    privateKey : 'private_Z1m8hHQMOn2Zse+9PHLmETaWqVU=',
    urlEndpoint : 'https://ik.imagekit.io/lkz5sclds'
});


export const destroyImage = async (fileId) => {
    try {
      const result = await imagekit.deleteFile(fileId);  // Delete the file using its fileId
      // console.log('File deleted:', result);
      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete image from ImageKit');
    }
  };
export default imagekit;
