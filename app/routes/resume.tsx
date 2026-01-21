import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { usePuterStore } from '~/lib/puter';

export const meta = () => ([
    {title: 'Resumind | Review'},
    {name: 'description', content: 'Detailed overview of your resume'}
])

const Resume = () => {
    const { id } = useParams();
    const {auth, kv, isLoading, fs} = usePuterStore();
    const [imageUrl, setImageUrl] = useState('');
    const [ resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState('')
    const navigate = useNavigate();

    

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)

            if(!resume) return;

            const data = JSON.parse(resume)

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log(imageUrl, resumeUrl, data.feedback)
        } 
        loadResume();
    }, [id])

    
    return(
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src=" " alt="" className="w-2.5 h-2.5"/>
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
        </main>
    )
}

export default Resume;