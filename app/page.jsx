import Feed from "@components/Feed"

const Home = () => {
  return (
    <section className="w-full flex-center flex-col feed-sec">
        <h1 className="head_text text-center">
          <p className="my-4">BLOGIT</p>
        <span className="cyan_gradient text-center">
        Discover, click, explore!
        </span>

        {/* Feed */}
        </h1>
        <p className="desc text-center">
        Welcome to our blog! Dive into captivating stories, insightful tips, and thought-provoking ideas. Whether it's travel adventures, lifestyle hacks, or moments of reflection, join our community for enriching experiences and shared journeys. Let's explore together!
        </p>
        <Feed/>
    </section>
  )
}

export default Home
