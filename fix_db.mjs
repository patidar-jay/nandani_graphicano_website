// Fix the contact data in DB to include links array
const url = 'https://lcudchwoimjpatbxgsho.supabase.co/rest/v1/site_data?id=eq.1&select=data';
const key = 'sb_publishable_F1v0RXWHEr-MCYlJaue4SA_SVjYHHAd';

async function fix() {
    // First get current data
    const res = await fetch(url, { headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } });
    const rows = await res.json();
    const currentData = rows[0].data;

    console.log('Current contact:', JSON.stringify(currentData.contact, null, 2));

    // Build links from flat fields if links missing
    if (!currentData.contact.links || !Array.isArray(currentData.contact.links) || currentData.contact.links.length === 0) {
        const links = [];
        if (currentData.contact.whatsapp) links.push({ platform: 'whatsapp', value: currentData.contact.whatsapp });
        if (currentData.contact.instagram) links.push({ platform: 'instagram', value: currentData.contact.instagram });
        if (currentData.contact.email) links.push({ platform: 'email', value: currentData.contact.email });
        currentData.contact.links = links;

        console.log('Fixed contact:', JSON.stringify(currentData.contact, null, 2));

        // Save back
        const patchUrl = 'https://lcudchwoimjpatbxgsho.supabase.co/rest/v1/site_data?id=eq.1';
        const patchRes = await fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                'apikey': key,
                'Authorization': 'Bearer ' + key,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ data: currentData })
        });
        console.log('Patch status:', patchRes.status);
        if (patchRes.ok) {
            console.log('DB fixed successfully!');
        } else {
            console.log('Error:', await patchRes.text());
        }
    } else {
        console.log('Links already present, no fix needed');
    }
}

fix();
