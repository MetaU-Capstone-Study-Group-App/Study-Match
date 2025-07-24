import '../styles.css'
import { useEffect, useState } from 'react';
import EmptyStar from '/src/images/empty-star.png'
import YellowStar from '/src/images/yellow-star.png'

const MemberCard = ({name, email, phoneNumber, profilePicture, fetchData, id, user}) => {
    const [uploadedProfilePic, setUploadedProfilePic] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [existingFavorites, setExistingFavorites] = useState([]);
    const [favoritedSpecificUser, setFavoritedSpecificUser] = useState([]);

    const fetchProfilePicture = async () => {
        const profilePictureArray = new Uint8Array(Object.values(profilePicture));
        const imageBlob = new Blob([profilePictureArray]);
        setUploadedProfilePic(URL.createObjectURL(imageBlob));
    }

    const handleDisplayFavorites = async () => {
        const favorites = await fetchData(`user/favorite/${user.id}`, "GET");
        setExistingFavorites(favorites);
        if (favorites && favorites.length !== 0){
            const specificUserFavorites = favorites.filter(userFavorite => userFavorite.favorite_user === id);
            setFavoritedSpecificUser(specificUserFavorites);
            if (specificUserFavorites.length !== 0){
                setIsFavorited(true);
            }
        }
    }

    const handleFavorite = async () => {
        if (isFavorited){
            if (favoritedSpecificUser.length !== 0){
                for (const userFavorite of favoritedSpecificUser){
                    const deletedUserFavorite = await fetchData(`user/favorite/${userFavorite.id}`, "DELETE");
                }
            }
            setIsFavorited(false);
        }
        else {
            if (favoritedSpecificUser.length === 0){
                const newUserFavoriteData = {
                    logged_in_user: user.id,
                    favorite_user: id
                }
                const newUserFavorite = await fetchData("user/favorite/", "POST", {"Content-Type": "application/json"}, "include", JSON.stringify(newUserFavoriteData));
            }
            setIsFavorited(true);
        }
    }

    useEffect(() => {
        if (profilePicture){
            fetchProfilePicture();
        }
    }, [])

    useEffect(() => {
        if (user){
            handleDisplayFavorites();
        }
    }, [isFavorited])

    return (
        <div className="member-card">
            <img src={uploadedProfilePic ? uploadedProfilePic : "src/images/profile-pic.png"} alt={name} className="profile-pic" width="70" height="70"/>
            <div className="member-card-info">
                <div className="member-card-name">{name}</div>
                <div className="member-card-email">{email}</div>
                <div className="member-card-phone-number">{phoneNumber}</div>
            </div>
            <div className="member-card-info-favorite">
                <img src={isFavorited ? YellowStar : EmptyStar} width="20" height="20" onClick={handleFavorite} className="favorite-button"/>
            </div>
        </div>
    )
}

export default MemberCard;