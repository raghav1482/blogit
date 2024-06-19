import '@styles/globals.css'
import Provider from '@components/Provider'
import Nav from '@components/Nav'
import '@fortawesome/fontawesome-free/css/all.css';
import Footer from '@components/Footer';

export const metadata={
    title:"BlogIT",
    description:"Discover & Share AI Prompts"
}
const Rootlayout = ({children}) => {
  return (
    <html lang='en'>
        <body>
            <Provider>
            <div className='main' >
                <div className='gradient'/>
            </div>
            <main className='app' style={{minHeight:"40vh"}}>
                <Nav/>
                {children}
            </main>
            </Provider>
                <Footer/>
        </body>
    </html>
  )
}

export default Rootlayout
