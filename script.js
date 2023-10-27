(async () => {
    const sleep = async (ms) => await new Promise(res => setTimeout(res, ms))
    const answerQuestion = async () => {
        await sleep(2*1000)
        console.info('slept 1')
        const answers = [...$('#answercontainer').find('.col-12.mb-1')]
        let query = "Let's play a game. I want you to pretend to be a smart robot. I will quiz you on a question regarding computer science. I will give you the question followed by answers with numbers beside them. You must only respond with the number for your answer and nothing additional. Only respond with the number. Here is the first question and answers:\n"
        query += $('#questiontext').text() + '\n'
        query += answers.slice(0, -1).map((el, i) => `${i}: ${el.innerText}`).join('\n')
        console.log(query)
        const req = await fetch(`https://localhost:3000/api/v1/gpt`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                content: query,
                id: null
            })
        })
        const res = await req.text()
        console.info('AI Response:', res)
        const matches = res.match(/\d+/)
        if (!matches) {
            console.error('No numbers in response')
            return await answerQuestion()
        }
        const answerIndex = matches[0]
        console.log('Answer:', answerIndex)
        const answer = answers[answerIndex]
        await sleep(2*1000)
        console.info('slept 2')
        $(answer).find('.js_answerButton').click()
        await new Promise(res => {
            const a = setInterval(() => {
                if (!$('#advicecontainer').hasClass('kt-hidden')) {
                    clearInterval(a)
                    res()
                }
            }, 100)
        })
        $('#lnkNext').click()
        return await answerQuestion()
    }
    answerQuestion()
})()
