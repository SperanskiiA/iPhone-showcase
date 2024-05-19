import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
gsap.registerPlugin(ScrollTrigger)

export const animateWithGsapTimeline = (
    timeline,
    rotationRef,
    rotationState,
    firstTarget,
    secondTarget,
    options
) => {
    timeline.to(rotationRef.current.rotation, {
        y: rotationState,
        duration: 1,
        ease: 'power2.inOut',
    })

    timeline.to(
        firstTarget,
        {
            ...options,
            ease: 'power2.inOut',
        },
        '<'
    )

    timeline.to(
        secondTarget,
        {
            ...options,
            ease: 'power2.inOut',
        },
        '<'
    )
}

export const animateWithGsap = (target, options, scrollOptions) => {
    gsap.to(target, {
        ...options,
        scrollTrigger: {
            trigger: target,
            toggleActions: 'restart reverse restart reverse',
            start: 'top 85%',
            ...scrollOptions,
        },
    })
}
