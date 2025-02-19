import React, { useState, useEffect } from 'react';
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from '../config/firebase';
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import '../styles/StudentHome.css';
import CloseIcon from "../icons/CloseIcon";
import SearchIcon from "../icons/SearchIcon";
import { useNavigate } from "react-router-dom";

const StudentHome = () => {
    const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [data, setData]= useState(null);
  const loggedInEmail = auth?.currentUser?.email;
  const [email, setEmail] = useState(loggedInEmail);
  const [coursesData, setCoursesData] = useState(null);

  const navigate = useNavigate();

  const handleFilter = (event) => {
    console.log(filteredData);
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.courseTitle.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const getCourse = async () => {
    try{
     
        const q = query(collection(db, "COURSESCREATED"));

        const querySnapshot = await getDocs(q);

        setData(querySnapshot.docs.map((doc)=> ({...doc.data(), id:doc.id})));
    } catch(err){
        console.log(err.message);
    }
    };

    useEffect(() => {
        console.log("User logged in: ", loggedInEmail);
        const unsubscribe = onAuthStateChanged(auth, (userData)=>{
            if(userData){
                setEmail(userData.email);
                getCourse();
            }
        });
        
        return () => {
            unsubscribe();
        }
    }, [loggedInEmail]);

    const toCourseOverview = (theCourseID) => {
      // navigate(`/dashboard/courseOverview/${theCourseID}`);
      window.open(`${window.location.origin}/${'dashboard/courseOverview/'}${theCourseID}`);
    };

    return(
        <section className='student-home'>
            <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder='Course Title...'
          value={wordEntered}
          onChange={handleFilter} />
        <div className="BellIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a key={key} className="dataItem" href={`/dashboard/courseOverview/${value.id}`} target="_blank">
                <p>{value.courseTitle} </p>
              </a>
            );
          })}
        </div>   
      )} 
        </div><div className='student-home__header'>
        <p className='student-home__title'>Courses To Explore</p>
      </div><div className='student-home__card-list'>
        {data === null ? null : data.map((course) => {
          return (
            <article className='course-card' key={course.id} onClick={()=>{toCourseOverview(course.id)}}>
              <div className='course-pic'>
                <img className='course-thumbnail' src={course.courseThumbnail} alt='courseThumbnail' />

              </div>
              <div className='course-card__details'>
                <div>
                  <p className='course-title'>{course.courseTitle}</p>
                </div>
              </div>

            </article>
          );
        })}
      </div>
        </section>
    );
};
export default StudentHome;