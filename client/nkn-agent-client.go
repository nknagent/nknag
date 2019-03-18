package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

func main() {
	MakeRequest()
}

func icanhazip() string {
	resp, err := http.Get("http://ipv4.icanhazip.com")
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	return strings.TrimSpace(string(body))
}

func MakeRequest() {
	ip := icanhazip()

	log.Println(ip)

	client := &http.Client{}

	req, err := http.NewRequest("PUT", "http://"+os.Args[1]+"/server/"+url.QueryEscape(ip), nil)
	if err != nil {
		log.Fatalln(err)
	}

	req.Header.Add("Authorization", os.Args[2])
	resp, err := client.Do(req)

	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println(string(body))
}
