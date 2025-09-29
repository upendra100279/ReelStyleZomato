import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        const fetchSavedFoods = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/food/save", { withCredentials: true });
                const savedFoods = Array.isArray(response.data.savedFoods)
                    ? response.data.savedFoods
                        .filter(item => item && item.food)
                        .map(item => ({
                            _id: item.food._id,
                            video: item.food.video,
                            description: item.food.description,
                            likeCount: item.food.likeCount,
                            savesCount: item.food.savesCount,
                            commentsCount: item.food.commentsCount,
                            foodPartner: item.food.foodPartner,
                        }))
                    : [];
                setVideos(savedFoods);
            } catch (error) {
                console.error("Failed to fetch saved foods:", error);
                setVideos([]);
            }
        };
        fetchSavedFoods();
    }, []);

    const removeSaved = async (item) => {
        try {
            await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved
