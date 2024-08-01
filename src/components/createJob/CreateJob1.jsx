import React, { useState } from 'react'
import { LuArrowLeft } from 'react-icons/lu'
import { RiImageAddLine } from "react-icons/ri";
import CreatePageIndicator from './CreatePageIndicator';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { imageDB } from '../../../firebaseConfig';
import toast from 'react-hot-toast';
import { v4 } from 'uuid';

const CreateJob1 = ({setScreen,setNewJob,newJob,nav,setLoading}) => {
    const [img,setImg]=useState(newJob.logo)

    async function nextScreen(){
        try{
            if(newJob.company==""||newJob.title==""||newJob.bounty==""||newJob.jobDetail==""){
                toast.error("Please do not leave any fields empty!")
                return
            }
            setLoading(true)
            if(img==""){
                toast.error("Please choose a company image!")
                setLoading(false)

                return
            }
            if(newJob.bounty=="0"){
                toast.error("Bounty price cannot be 0!")
                setLoading(false)
                return
            }
            if(typeof img=="string"){
                setScreen(2)
                 setLoading(false)

                return
            }
            let url=await uploadImage(img)
            setLoading(false)
            setNewJob({...newJob,logo:url})
            setScreen(2)
        }catch(err){
            console.log(err)
            setLoading(false)
        }
    }

    async function uploadImage(uri){
        
        return new Promise(async(resolve,reject)=>{
          const storageRef = ref(imageDB, 'userImage/' + v4());
          const uploadTask = uploadBytesResumable(storageRef,uri);
      
          uploadTask.on(
            'state_changed',
            snapshot => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            error => {
                setLoading(false)
              console.log('Error => ', error);
              reject(new Error("Some error occured while trying to upload images"))
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
                console.log('File available at', downloadURL);
                setLoading(false)
                resolve(downloadURL)
              });
            },
          );
        })
        
      };

  return (
    <div className='create-job-cont'>
        <div className="create-job-header1">
            <LuArrowLeft className='create-job-back-icon1' onClick={()=>nav('/adminHome')}/>
            <h1 className="create-job-title">List Job</h1>
        </div>
        <CreatePageIndicator page={1}/>
        <div className="create-job1-form">
            <input 
                type="file"  
                id="job-img" 
                style={{display:'none'}}
                onChange={(e)=>{
                    setNewJob({...newJob,logo:e.target.files[0]})
                    setImg(e.target.files[0])
                    console.log(e.target.files[0])
                }}
            />
            {
                img==""?
                <div className="cj1-logo-cont" onClick={()=>{
                    document.getElementById('job-img').click()
                }}>
                    <div className="cj1-logo">
                        <RiImageAddLine className='cj1-logo-icon'/>
                    </div>
                    <p className="cj1-logo-label">Campany Logo</p>
                </div>
                :
                <img 
                    onClick={()=>{
                        document.getElementById('job-img').click()
                    }} 
                    className='cj1-comp-logo' 
                    src={(typeof img =="string")?img:URL.createObjectURL(img)} 
                    alt="ksk" 
                />

            }
           
            <div className="cj1-inp-item">
                <p className="cj1-inp-label">
                Job Title
                </p>
                <input value={newJob.title} onChange={(e)=>setNewJob({...newJob,title:e.target.value})} type="text" className="cj1-inp" />
            </div>
            <div className="cj1-inp-item">
                <p className="cj1-inp-label">
                Company Name
                </p>
                <input value={newJob.company} onChange={(e)=>setNewJob({...newJob,company:e.target.value})} type="text" className="cj1-inp" />
            </div>
            <div className="cj1-inp-item">
                <p className="cj1-inp-label">
                Enter Bounty Prize In Dollar
                </p>
                <input  
                    value={newJob.bounty} 
                    onChange={(e)=>{
                            if(parseInt(e.target.value)<0){
                                return
                            }
                            setNewJob({...newJob,bounty:e.target.value})
                        }
                    } 
                    type="number" 
                    className="cj1-inp" 
                />
            </div>
            <div className="cj1-inp-item">
                <p className="cj1-inp-label">
                Add Job Details
                </p>
                <input value={newJob.jobDetail} onChange={(e)=>setNewJob({...newJob,jobDetail:e.target.value})} type="text" className="cj1-inp" />
            </div>
            <button className="create-job-submit-btn" onClick={nextScreen}>
                Next
            </button>
        </div>
    </div>
  )
}

export default CreateJob1