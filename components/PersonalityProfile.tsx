export default function PersonalityProfile({ characteristics }: { characteristics: any }) {
  return (
    <>
      {characteristics.map((trait: any, index: any) => (
        <div key={index} className="text-white border-[0.3px] border-gray-300 p-2 flex-shrink-0">
          <div className="text-[10px]">{trait}</div>
        </div>
      ))}
    </>
  )
}

