import '../styles.css'
import { useEffect, useState } from 'react';
import DefaultProfilePic from "/src/images/profile-pic.png";

const MemberCard = ({name, email, phoneNumber, profilePicture, fetchData, id}) => {
    const [uploadedProfilePic, setUploadedProfilePic] = useState(null);

    const fetchProfilePicture = async () => {
        const profilePictureArray = new Uint8Array(Object.values(profilePicture));
        const imageBlob = new Blob([profilePictureArray]);
        setUploadedProfilePic(URL.createObjectURL(imageBlob));
    }

    useEffect(() => {
        if (profilePicture){
            fetchProfilePicture();
        }
    }, [])

    return (
        <div className="member-card">
            <img src={uploadedProfilePic ? uploadedProfilePic : DefaultProfilePic} alt={name} className="profile-pic" width="70" height="70"/>
            <div className="member-card-info">
                <div className="member-card-name">{name}</div>
                <div className="member-card-email">{email}</div>
                <div className="member-card-phone-number">{phoneNumber}</div>
            </div>
        </div>
    )
}

export default MemberCard;