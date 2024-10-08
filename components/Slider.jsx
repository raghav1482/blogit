import React from "react";
import Carousel from "@itseasy21/react-elastic-carousel";
import "@styles/slider.css";
import PromptCard from "./PromptCard";
import "./style.css";

const breakPoints = [
    { width: 1, itemsToShow: 1, itemsToScroll: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 1 },
    { width: 768, itemsToShow: 3, itemsToScroll: 1 },
    { width: 1200, itemsToShow: 4, itemsToScroll: 1 },
];

export default function Slider(props) {
    // Shuffle the data array
    const shuffledData = [...props.data].sort(() => 0.5 - Math.random());

    const dataToShow = shuffledData.length > 0 ? shuffledData:[];

    return (
        <div className="slider">
            <Carousel breakPoints={breakPoints}>
                {dataToShow.map(post => (
                    <PromptCard
                        key={post._id}
                        creator={post.creator}
                        img={post.img}
                        post={post}
                        tag={post.tag}
                        title={post.title}
                        handleEdit={() => props.handleEdit && props.handleEdit(post)}
                        handleDelete={() => props.handleDelete && props.handleDelete(post)}
                    />
                ))}
            </Carousel>
        </div>
    );
}
