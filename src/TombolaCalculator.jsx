// ... importuri existente
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import jsPDF from "jspdf";
import emailjs from "emailjs-com";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// ... funcții existente

export default function TombolaCalculator() {
  const [price, setPrice] = useState(50);
  const [tickets, setTickets] = useState([]);
  const [winners, setWinners] = useState([]);
  const [name, setName] = useState("");
  const [cnp, setCnp] = useState("");
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptGDPR, setAcceptGDPR] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const masina = 78000;
  const profit = 20000;
  const total = masina + profit;
  const ticketTarget = Math.ceil(total / price);

  const drawDate = new Date("2025-04-15T12:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = drawDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days} zile, ${hours} ore, ${minutes} minute`);
      } else {
        setTimeLeft("Extragerea a avut loc.");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [drawDate]);

  const pickWinner = () => {
    if (tickets.length === 0) {
      alert("Nu există bilete pentru extragere.");
      return;
    }
    const winner = tickets[Math.floor(Math.random() * tickets.length)];
    setWinners(prev => [...prev, winner]);
    alert(`🎉 Câștigător: ${winner.name} (${winner.email}) - Cod: ${winner.code}`);
  };

  const filteredTickets = tickets.filter(ticket => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.name.toLowerCase().includes(term) ||
      ticket.email.toLowerCase().includes(term) ||
      ticket.code.toLowerCase().includes(term)
    );
  });

  const progressData = [
    { name: "Vândute", value: tickets.length },
    { name: "Necesar", value: Math.max(0, ticketTarget - tickets.length) }
  ];

  const userTicketsCount = tickets.filter(t => t.email === email).length;
  const winningChance = tickets.length > 0 ? ((userTicketsCount / tickets.length) * 100).toFixed(2) : 0;
  const chartData = [
    { name: "Biletele tale", value: userTicketsCount },
    { name: "Restul biletelor", value: tickets.length - userTicketsCount }
  ];

  return (
    <div className="flex h-screen">
      {adminMode && (
        <div className="w-64 bg-gray-100 p-4 shadow-xl">
          <h2 className="text-lg font-bold mb-4">Dashboard Admin</h2>
          <ul className="space-y-2">
            <li><Button variant="outline" className="w-full">📄 Vizualizare bilete</Button></li>
            <li><Button variant="outline" className="w-full" onClick={pickWinner}>🎰 Extragere câștigător</Button></li>
            <li><Button variant="outline" className="w-full">📤 Export CSV</Button></li>
            <li><Button variant="outline" className="w-full">⚙️ Setări tombolă</Button></li>
          </ul>
          <div className="mt-6">
            <Button variant="destructive" className="w-full" onClick={() => setAdminMode(false)}>Ieși din Admin</Button>
          </div>
        </div>
      )}
      <div className="flex-1 p-6 bg-white overflow-auto">
        {!adminMode && (
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={() => setAdminMode(true)}>Mod Admin</Button>
          </div>
        )}
        {adminMode ? (
                    <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 shadow rounded-xl">
                <h3 className="font-semibold mb-2">Progres vânzare bilete</h3>
                <BarChart width={300} height={200} data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </div>
              <div className="bg-white p-4 shadow rounded-xl">
                <h3 className="font-semibold mb-2">Timp rămas până la extragere</h3>
                <p className="text-xl font-bold text-center">{timeLeft}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">Calculator Tombolă Mașină</h1>
            <p className="text-center text-gray-600 mb-4">Timp rămas: <strong>{timeLeft}</strong></p>
            <p className="text-center text-sm text-gray-500 mb-4">Bilete cumpărate până acum: <span className="font-semibold text-gray-800">{tickets.length}</span></p>
            {userTicketsCount > 0 && (
              <div className="text-center text-green-600 font-semibold mb-4">
                Ai cumpărat {userTicketsCount} bilet(e). Șansa ta de câștig: {winningChance}%
              </div>
            )}
            {userTicketsCount > 0 && (
              <div className="flex justify-center mb-6">
                <PieChart width={250} height={200}>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            )}
            <input type="text" placeholder="Nume" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
            <input type="text" placeholder="CNP" value={cnp} onChange={e => setCnp(e.target.value)} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
            <div>
              <label className="text-sm">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                <span className="ml-2">Accept regulamentul</span>
              </label>
            </div>
            <div>
              <label className="text-sm">
                <input type="checkbox" checked={acceptGDPR} onChange={(e) => setAcceptGDPR(e.target.checked)} />
                <span className="ml-2">Accept GDPR</span>
              </label>
            </div>
            <div className="flex justify-center gap-4 my-4">
  {[5, 10, 20].map(val => (
    <Button
      key={val}
      variant={price === val ? "default" : "outline"}
      onClick={() => setPrice(val)}
      className={`px-6 py-2 text-lg rounded-xl shadow-md transition-all duration-200 ${price === val ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
    >
      {val} €
    </Button>
  ))}
</div>
            <p className="text-center mt-2 mb-4">Preț bilet: <strong>{price} €</strong></p>
            <Button className="w-full" onClick={() => {
              if (!name || !cnp || !email || !acceptTerms || !acceptGDPR) {
                alert("Completează toate câmpurile și acceptă termenii.");
                return;
              }
              const code = generateUniqueCode(tickets.map(t => t.code));
              const date = new Date().toLocaleString();
              const newTicket = { name, cnp, email, code, date };
              const updated = [...tickets, newTicket];
              setTickets(updated);
              const pdf = generatePDF(newTicket);
              pdf.save(`bilet_tombola_${code}.pdf`);
              sendEmailWithPDF(newTicket, pdf);
              alert(`Bilet cumpărat cu succes! Cod: ${code}`);
            }}>
              Cumpără bilet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
