import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import { addDescription } from '../../redux/slices/cardModalSlice';
import ReactQuill from 'react-quill';
import { db } from '../../config/firebaseConfig';
import 'react-quill/dist/quill.snow.css'; 


function CardDescription({ cardID }) {
    const dispatch = useDispatch();
    const descriptions = useSelector((state) => state.cardModal.descriptions);
    const description = descriptions.find(card => card.cardID === cardID);
    const [text, setText] = useState('');
    useEffect(() => {
        const fetchDescriptions = async () => {
          const descriptionsCollection = collection(db, 'descriptions')
          const snapshot = await getDocs(descriptionsCollection)
          snapshot.docs.reverse().map((doc) => (dispatch(addDescription({ ...doc.data() }))))
        }
    
        if (!descriptions.length) fetchDescriptions()
        
    }, [descriptions.length, dispatch])

    const handleChange = (value) => {
        setText(() => value);
    };

    const handleSave = async () => {
        dispatch(addDescription({ cardID, description: text }))
        let updated = false;
        const descriptionsCollection = collection(db, 'descriptions');
        const snapshot = await getDocs(descriptionsCollection)
        for(let descriptionDoc of snapshot.docs.filter(doc => doc.data().cardID === cardID)) {
            if (descriptionDoc.id) {
                await updateDoc(doc(db, 'descriptions', descriptionDoc.id), { cardID, description: text});
            } 
            updated = true;
        }
        
        if (!updated)
            await addDoc(descriptionsCollection, { cardID, description: text })
        setText(() => '');
    };

    const edit = () => {
        setText(() => description.description);
    }

    const clearText = () => {
        setText(() => '');
    }

    return (
        <div className='description-block'>
            <h3 className='description-title'> <sup className='description-quote'><i className='fa-solid fa-quote-left'></i></sup> Card description </h3>
            <div className='description scroll_effect'>
                <div className='description-text'>
                    { 
                        description && description?.description !== '<p><br></p>' &&
                        <div dangerouslySetInnerHTML={{ __html: description.description }} />
                    }

                    {
                        (!description ||  description?.description === '<p><br></p>') && <div>Add description <i className="fa-solid fa-arrow-down-long"></i></div>
                    }
                </div>
            </div>
            <ReactQuill
                value={text}
                onChange={handleChange}
                modules={{
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean'],
                    ],
                }}
                formats={[
                    'bold', 'italic', 'underline', 'strike',
                    'header', 'script', 'size',
                    'color', 'background',
                ]}
            />
            <div className='description-buttons'>
                <button onClick={handleSave} className='description-btn' disabled={!text}><i className='fa-solid fa-floppy-disk'></i></button>
                <button onClick={edit} className='edit-btn description-btn' disabled={!description}><i className='fa-solid fa-pen'></i></button>
                <button onClick={clearText} className='description-btn' disabled={!text}><i className='fa-solid fa-xmark'></i></button>
            </div>
        </div>
    )
}

export default CardDescription;