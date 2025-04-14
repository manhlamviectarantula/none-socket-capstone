import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SliderBanner1 from '../../components/SliderBanner1'
import SliderBanner2 from '../../components/SliderBanner2'
import Features from '../../components/Features'
import CardSlider from '../../components/CardSlider'

const Home = () => {
  return (
    <>
      <Header />
      <SliderBanner1/>
      <Features/>
      <SliderBanner2/>
      <CardSlider/>
      <Footer/>
    </>
  )
}

export default Home
