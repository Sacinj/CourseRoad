import React, { useEffect, useRef, useState } from 'react';
import '../styles/CreateCourse.css'
import {db, storage} from '../config/firebase';
import { collection, addDoc, serverTimestamp, setDoc, query, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { async } from '@firebase/util';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateCourse = () =>{
    const courseTitleRef = useRef();
    const courseDescriptionRef = useRef();
    const chapterTitleRef = useRef();
    const chapterDescriptionRef = useRef();
    const [displayChapterForm, setDisplayChapterForm] = useState(false);
    /* const courseIDRef = useRef();
    const chapterIDRef = useRef(); */
    const [courseID, setCourseID] = useState();
    const [chapterID, setChapterID] = useState();
    /* let theCourseID;
    let theChapterID; */
    const [imageUpload, setImageUpload] = useState(null);
    const [coursethumbnail, setCourseThumbnail] = useState(null);
    const [fileUpload, setFileUpload] = useState(null);

    const navigate = useNavigate();

    /* useEffect(() => {
      console.log(getChapters());
      console.log(chapterID);
      return () => {
        
      }
    }, [chapterID]); */
    

    const saveCourse = async () => {

        navigate("/dashboard");

        /* This button will use setDoc to update the fields that require their own
        firebase generated IDs and also to route back to the dashboard */
        
        /* let courseTitleNoSpace = courseTitleRef.current.value.split(' ').join('');
        let courseTitledoc = courseTitleNoSpace.toLowerCase(); */
        /* let courseDocUID = crypto.randomUUID();

        console.log(courseDescriptionRef.current.value, chapterDescriptionRef.current.value, chapterTitleRef.current.value);

        courseTitleRef.current.value = '';
        courseDescriptionRef.current.value = ''; */

        /* try {
            await setDoc(doc(db, "COURSESCREATED", courseDocUID), {
                // ...doc.data,
                [qNumber]: newQuestion,
                [aNumber]: newAnswer,

            }, {merge: true});

            setNextNumber(nextNumber+1);
            setNewAnswer("");
            setNewQuestion("");
        } catch (err) {
            console.error(err); 
        }  */
    };
    const createCourse = async (e) => {
        e.preventDefault();
// Add a new document with a generated id.
        // theCourseID = crypto.randomUUID();
        // console.log()
        // setCourseID(crypto.randomUUID())
        // console.log("Inside createCourse courseID: ",courseIDRef.current.value);
        // try{
            const docRef = await addDoc(collection(db, "COURSESCREATED"), {
                courseTitle: courseTitleRef.current.value,
                courseDescription: courseDescriptionRef.current.value,
                courseTeacher: "",
                courseID: "",
                dateCreated: serverTimestamp(),
                courseImage: "",
                numberOfStudents: 0
    
            }).then((docRef)=>{
                // theCourseID=docRef.id;
                setCourseID(docRef.id);
                // console.log("Inside the then funct courseID: ", courseID);
                setDisplayChapterForm(true);
            }).catch((error) => {
                console.error('Error adding course: ', error);
            });
            /* console.log("Document Course written with ID: ", docRef.id);
            const courseDocID = docRef.id;
            console.log("const var doc ID: ",courseDocID);
            theCourseID = docRef.id; */
            // setCourseID(courseDocID);
            // courseIDRef.current.value = docRef.documentID;
            // console.log("Course IDREF: ",courseIDRef.current.value);
        //     setDisplayChapterForm(true);
        // } catch (err) {
        //     console.error(err);
        // }
        // console.log("Course ID useState",courseID);
        // console.log(theCourseID);
    }

    const addChapter = async (id) => {
        // e.preventDefault();
        // console.log("Insifde",theCourseID);
        console.log("Inside addChapter courseID: ",courseID);
            const chapterDocRef = await addDoc(collection(db, "CHAPTERS"), {
                chapterTitle: chapterTitleRef.current.value,
                chapterDescription: chapterDescriptionRef.current.value,
                chapterID: "",
                dateCreated: serverTimestamp(),
                chapterFiles: "",
                courseID: courseID
    
            }).then(async (chapterDocRef)=>{
                // theChapterID=chapterDocRef.id;
                // console.log("Inside the then funct courseID: ", theChapterID);
                setChapterID(chapterDocRef.id);
                // TO DO: using course ID 
                const courseDocRef = doc(db, "COURSESCREATED", courseID)
                
                    await updateDoc(courseDocRef, {
                        chapters: arrayUnion({
                            chapterID: chapterDocRef.id, 
                            chapterTitle:  chapterTitleRef.current.value,
                            chapterDescription:  chapterDescriptionRef.current.value
                        })
                    }). then((courseDocRef)=>{
                        console.log("Successfully upadted chpater");
                    }).catch((error) => {
                        console.error('Error upddating', error);
                    });
                
                console.log("Success");
            }).catch((error) => {
                console.error('Error adding chapter: ', error);
                console.log("Error");
            });
            
    } 
    const getChapters = async (id) => {
       const q = query(collection(db, "CHAPTERS"));
       const querySnapshot = await getDocs(q)
       const chapterArr = querySnapshot.docs.map(async (doc)=> {
        const data = doc.data();
        return data;
       })
       const chapterData = await Promise.all(chapterArr);
       return chapterData;
            
    } 

    const createExam = () => {

        /* let courseTitleNoSpace = courseTitleRef.current.value.split(' ').join('');
        let courseTitledoc = courseTitleNoSpace.toLowerCase() + crypto.randomUUID();
        console.log(courseTitledoc); */
    }

    const uploadImage = () =>{
        if(imageUpload == null) return;

        const imageRef = ref(storage, `courseThumbnails/${imageUpload.name + crypto.randomUUID()}`);
        uploadBytes(imageRef, imageUpload).then(()=>{
            alert("Image Uploaded");
            getDownloadURL(imageRef).then((url)=>{
                setCourseThumbnail(url);
                console.log("The picture URL: ",url);
            }).catch((error) => {
                console.error('Error getting image URL: ', error);
            });
            
        }).catch((error) => {
            console.error('Error uploading image: ', error);
        });
    };

    const uploadFile = () => {

    };
    
    return(
        <section className='createCourse'>
            <h1>Create Course</h1>

            <div className='edit-course-container'>
                <article className='course-head article-flex'>
                        <div className='createCourse__text-inputs'>
                            <input className='course-head__textbox' type='text' ref={courseTitleRef} placeholder='Course Title' required></input>
                            <textarea className='course-head__textbox' rows={15} ref={courseDescriptionRef} placeholder='Course Description...'></textarea>
                        </div>
                        <div className='createCourse__files-buttons'>
                            <input type='file' onChange={(event)=> {setImageUpload(event.target.files[0])}} ></input>
                            <button onClick={uploadImage}>Upload File</button>
                            <button type='button' onClick={createCourse}>Create Course</button>
                            <button type='button' onClick={createExam}>Create Exam</button>
                        </div>
                </article>

                <article className='added-chapter article-flex'>
                    {chapterTitleRef.current=== undefined ? null : <div>
                        <p>{chapterTitleRef.current.value}</p>
                        <p>{chapterDescriptionRef.current.value}</p>
                    </div>}
                </article>

                {
                    displayChapterForm && <article className='add-new-chapter article-flex'>
                        
                            <div className='createCourse__text-inputs' >
                                <input type='text' ref={chapterTitleRef} placeholder='Chapter Title' required></input>
                                <textarea rows={15} ref={chapterDescriptionRef} placeholder='Chapter Description...'></textarea>
                            </div>
                            <div className='createCourse__files-buttons'>
                                <input type='file'></input>
                                <button onClick={uploadFile}>Upload File</button>
                                <button type='submit' onClick={()=>addChapter(courseID)}>Add Chapter</button>
                            </div>
                        
                    
                </article>
                }
                
            </div>

            <div className='centered-btn'>
            <button className='save-course-btn' type='button' onClick={saveCourse}>Save Course</button>
            </div>

        </section>
    );
};

export default CreateCourse;