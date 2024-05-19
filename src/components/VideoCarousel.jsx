import { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap'
import { pauseImg, playImg, replayImg } from '../utils'
import { useGSAP } from '@gsap/react'

const VideoCarousel = () => {
    const videoRef = useRef([])
    const videoSpanRef = useRef([])
    const videoDivRef = useRef([])

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLast: false,
        isPlaying: false,
    })

    const [loadedData, setLoadedData] = useState([])

    const { isEnd, isLast, videoId, startPlay, isPlaying } = video

    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: 'power2.inOut',
        })
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none',
            },
            onComplete: () => {
                setVideo((prev) => ({
                    ...prev,
                    startPlay: true,
                    isPlaying: true,
                }))
            },
        })
    }, [isEnd, videoId])

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause()
            } else {
                startPlay && videoRef.current[videoId].play()
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData])

    const handleLoadedMetadata = (i, e) => setLoadedData((prev) => [...prev, e])

    useEffect(() => {
        let currentProgress = 0
        let span = videoSpanRef.current

        if (span[videoId]) {
            //animate progress of video
            let animate = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(animate.progress() * 100)

                    if (progress !== currentProgress) {
                        currentProgress = progress

                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? '10vw'
                                    : window.innerWidth < 1200
                                    ? '10vw'
                                    : '4vw',
                        })

                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: 'white',
                        })
                    }
                },

                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px',
                        })
                        gsap.to(span[videoId], {
                            backgroundColor: '#afafaf',
                        })
                    }
                },
            })

            if (videoId === 0) {
                animate.restart()
            }

            const animUpdate = () => {
                animate.progress(
                    videoRef.current[videoId].currentTime /
                        hightlightsSlides[videoId].videoDuration
                )
            }

            if (isPlaying) {
                gsap.ticker.add(animUpdate)
            } else {
                gsap.ticker.remove(animUpdate)
            }
        }
    }, [videoId, startPlay])

    const handleProcess = (action, i) => {
        switch (action) {
            case 'play':
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
                break

            case 'replay':
                setVideo((prev) => ({ ...prev, isLast: false, videoId: 0 }))
                break
            case 'end':
                setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }))
                break
            case 'last':
                setVideo((prev) => ({ ...prev, isLast: true }))
                break
            default:
                return video
        }
    }

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className=" sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline
                                    preload="auto"
                                    muted
                                    className={`${
                                        list.id === 2 && 'translate-x-44'
                                    } pointer-events-none`}
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onPlay={(prev) => ({
                                        ...prev,
                                        isPlaying: true,
                                    })}
                                    onLoadedMetadata={(e) =>
                                        handleLoadedMetadata(i, e)
                                    }
                                    onEnded={() => {
                                        i !== 3
                                            ? handleProcess('end', i)
                                            : handleProcess('last')
                                    }}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>
                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p
                                        key={text}
                                        className="md:text-2xl text-xl font-medium"
                                    >
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 rounded-full backdrop-blur">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                        >
                            <span
                                ref={(el) => (videoSpanRef.current[i] = el)}
                                className="absolute h-full w-full rounded-full"
                            />
                        </span>
                    ))}
                </div>
                <button className="control-btn">
                    <img
                        src={
                            isLast ? replayImg : isPlaying ? pauseImg : playImg
                        }
                        alt={isLast ? 'replay' : isPlaying ? 'pause' : 'play'}
                        onClick={
                            isLast
                                ? () => handleProcess('replay')
                                : isPlaying
                                ? () => handleProcess('play')
                                : () => handleProcess('play')
                        }
                    />
                </button>
            </div>
        </>
    )
}

export default VideoCarousel
