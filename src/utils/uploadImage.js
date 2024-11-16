


// const UploadImage = async () => {
//     setLoader(true);
//     const resp = await fetch(image);
//     const blob = await resp.blob();
//     const storageRef = ref(storage, "/petAdopt/" + Date.now() + ".jpg");

//     uploadBytes(storageRef, blob)
//       .then((snapshot) => {
//         console.log("File uploaded");
//       })
//       .then((resp) => {
//         getDownloadURL(storageRef).then(async (downloadUrl) => {
//           console.log(downloadUrl);
//           SaveFormData(downloadUrl);
//         });
//       });
//   };