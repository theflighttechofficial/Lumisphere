export default function NoiseLayer() {
    return (

        <div

            className="
                absolute
                inset-0
                opacity-[0.03]
                pointer-events-none
            "

            style={{
                backgroundImage:
                    "radial-gradient(rgba(255,255,255,.4) 1px, transparent 1px)",

                backgroundSize: "4px 4px",
            }}

        />

    );
}