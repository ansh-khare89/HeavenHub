import { AmbientBackdrop } from '../components/AmbientBackdrop';

export function AboutUsPage() {
  return (
    <div className="relative overflow-hidden min-h-[80vh]">
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl text-center mb-12">
          About <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">HeavenHub</span>
        </h1>
        
        <div className="space-y-12">
          <section className="rounded-3xl border border-white/10 bg-[#050b14]/80 p-6 md:p-10 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-sky-200 mb-4">Our Purpose</h2>
            <p className="text-slate-300 leading-relaxed">
              HeavenHub was born from a simple belief: finding a place to stay should be as magical as the journey itself. 
              We are a premium property booking platform designed to connect travelers with unique, verified stays across India.
              From heritage havelis in Rajasthan to serene backwater retreats in Kerala, our curated network ensures that every journey is memorable.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#050b14]/80 p-6 md:p-10 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-amber-200 mb-4">Our Vision & Mission</h2>
            <p className="text-slate-300 leading-relaxed">
              <strong>Vision:</strong> To redefine hospitality in India by creating a trusted, transparent, and seamless booking experience.
              <br /><br />
              <strong>Mission:</strong> We aim to empower hosts by providing them with robust tools to showcase their properties, while 
              offering guests an intuitive platform to discover their next perfect escape without hidden fees or unpleasant surprises.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#050b14]/80 p-6 md:p-10 shadow-xl backdrop-blur-md">
            <h2 className="text-2xl font-bold text-emerald-200 mb-4">Who Is HeavenHub For?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">For Guests</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Travelers looking for authentic, comfortable, and well-managed accommodations. 
                  Whether you are planning a solo adventure, a romantic getaway, or a family vacation, 
                  HeavenHub offers secure bookings with integrated transparent pricing.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">For Hosts</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Property owners who take pride in their spaces and hospitality. 
                  We provide you with absolute control over who stays at your property. 
                  Review booking requests, accept or decline, and get paid securely.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
